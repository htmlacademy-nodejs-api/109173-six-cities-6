// Слой-сервис, через который осуществляется взаимодействие с БД (сущность: User)
import { CreateUserDTO, UserEntity } from './index.js';
import { inject, injectable } from 'inversify';
import { Logger } from '../../libs/logger/logger.interface.js';
import { Component } from '../../types/component.enum.js';
import { FoundUser, UserDoc, UserService, UserToken } from './user-service.interface.js';
import { types } from '@typegoose/typegoose';
import { LoginUserDTO } from './dto/login-user.dto.js';
import { UpdateUserDTO } from './dto/update-user.dto.js';
import { FoundOffers } from '../offer/offer-service.interface.js';
import mongoose from 'mongoose';

const MessageText = {
  ADDED: 'New user successfully added. Email:',
} as const;
@injectable()
export class DefaultUserService implements UserService {
  constructor(
    @inject(Component.UserModel) private readonly userModel: types.ModelType<UserEntity>,
    @inject(Component.Logger) private readonly logger: Logger
  ){}

  public async create(dto: CreateUserDTO, salt: string): Promise<UserDoc> {
    const user = new UserEntity(dto);
    user.setPassword(dto.password, salt);

    const addedUser = await this.userModel.create(user);

    this.logger.info(`${MessageText.ADDED} ${user.email}`);

    return addedUser;
  }

  public async updateById(id: string, dto: UpdateUserDTO): FoundUser {
    return await this.userModel
      .findByIdAndUpdate(id, dto, {new: true})
      .exec();
  }

  public async login(dto: LoginUserDTO, salt: string): Promise<UserToken | null> {
    const user = await this.findByEmail(dto.email);
    const checkPassword = user?.checkPassword(dto.email, dto.password, user.password);

    if(!user || !checkPassword) {
      return null;
    }

    const token = user.createAuthToken(dto.email, dto.password, salt);

    await this.updateById(user?.id, { token });

    return token;
  }

  public async logout(token: UserToken): Promise<void> {
    const user = await this.userModel
      .findOne({ token })
      .exec();

    if(user) {
      const dto: UpdateUserDTO = {
        token: ''
      };

      this.updateById(user.id, dto);
    }
  }

  public async checkAuthStatus(id: string):FoundUser {
    return await this.userModel
      .findOne({ userId: id, token: { $ne: '' } })
      .exec();
  }

  public async findById(id: string): FoundUser {
    return await this.userModel.findById({ id }).exec();
  }

  public async findByEmail(email: string):FoundUser {
    return await this.userModel.findOne({ email }).exec();
  }

  public async findOrCreate(dto: CreateUserDTO, salt: string): Promise<UserDoc> {
    const existedUser = await this.findByEmail(dto.email);

    if(existedUser) {
      return existedUser;
    }

    return this.create(dto, salt);
  }

  public async addToFavoritesIds(userId: string, offerId: string): FoundUser {
    const userFavorites: string[] = await this.getFavoriteIds(userId);

    userFavorites.push(offerId);

    return await this.userModel.findByIdAndUpdate(userId, { favoriteOffers: userFavorites });
  }

  public async getFavoriteIds(userId: string): Promise<string[] | []> {
    const user = await this.userModel
      .findById(userId)
      .exec();

    return user?.favoriteOffers ?? [];
  }

  public async getFavoriteOffers(userId: string): FoundOffers {
    const userObjectId = new mongoose.Types.ObjectId(userId);
    const userFavoritesIds = await this.getFavoriteIds(userId);
    const userFavoritesObjectIds = userFavoritesIds.map((offerId) => new mongoose.Types.ObjectId(offerId));

    const [ userWithFavorites ] = await this.userModel
      .aggregate([
        { $match: { _id: userObjectId} },
        {
          $lookup: {
            from: 'offers',
            pipeline: [
              { $match: { $expr: { $in: ['$_id', userFavoritesObjectIds] } } }
            ],
            as: 'favoriteOffers'
          }
        }
      ])
      .exec();

    return userWithFavorites.favoriteOffers ?? null;
  }
}
