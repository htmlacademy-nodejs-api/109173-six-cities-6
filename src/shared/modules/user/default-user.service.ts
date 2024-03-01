// Слой-сервис, через который осуществляется взаимодействие с БД (сущность: User)
import { CreateUserDTO, UserEntity } from './index.js';
import { inject, injectable } from 'inversify';
import { Logger } from '../../libs/logger/logger.interface.js';
import { Component } from '../../types/component.enum.js';
import { FoundUser, UserDoc, UserService } from './user-service.interface.js';
import { types } from '@typegoose/typegoose';
import { UpdateUserDTO } from './dto/update-user.dto.js';
import { FoundOffers } from '../offer/offer-service.interface.js';
import mongoose from 'mongoose';
import { DocumentExists } from '../../types/document-exists.interface.js';
const MessageText = {
  ADDED: 'New user successfully added. Email:',
} as const;
@injectable()
export class DefaultUserService implements UserService, DocumentExists {
  constructor(
    @inject(Component.UserModel) private readonly userModel: types.ModelType<UserEntity>,
    @inject(Component.Logger) private readonly logger: Logger
  ){}

  public getEntityName(): string {
    return 'User';
  }

  public async create(dto: CreateUserDTO, salt: string): Promise<UserDoc> {
    const user = new UserEntity(dto);
    user.password = user.getPasswordHash(dto.password, salt);

    const addedUser = await this.userModel.create(user);

    this.logger.info(`${MessageText.ADDED} ${user.email}`);

    return addedUser;
  }

  public async updateById(id: string, dto: UpdateUserDTO): FoundUser {
    return await this.userModel
      .findByIdAndUpdate(id, dto, {new: true})
      .exec();
  }

  public async exists(userId: string): Promise<boolean> {
    const user = await this.userModel.exists({ _id: userId });

    return user !== null;
  }

  public async checkAuthStatus(email: string): FoundUser {
    return await this.userModel
      .findOne({ email, token: { $ne: '' } })
      .exec();
  }

  public async findById(id: string): FoundUser {
    return await this.userModel.findById({ id }).exec();
  }

  public async findByEmail(email: string): FoundUser {
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

    return await this.userModel
      .findByIdAndUpdate(userId, { favoriteOffers: userFavorites });
  }

  public async removeFromFavoritesIds(userId: string, offerId: string): FoundUser {
    const userFavorites: string[] = await this.getFavoriteIds(userId);

    userFavorites.filter((id) => id !== offerId);

    return await this.userModel
      .findByIdAndUpdate(userId, { favoriteOffers: userFavorites });
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
              { $match: { $expr: { $in: ['$_id', userFavoritesObjectIds] } } },
              { $set: { 'isFavorite': true } }
            ],
            as: 'favoriteOffers'
          }
        }
      ])
      .exec();

    return userWithFavorites.favoriteOffers ?? null;
  }
}
