// Слой-сервис, через который осуществляется взаимодействие с БД (сущность: User)
import { CreateUserDTO, UserEntity, UserModel } from './index.js';
import { inject, injectable } from 'inversify';
import { Logger } from '../../libs/logger/logger.interface.js';
import { Component } from '../../types/component.enum.js';
import { UserService } from './user-service.interface.js';
import { DocumentType, types } from '@typegoose/typegoose';

const MessageText = {
  ADDED: 'New user successfully added. Email:',
} as const;
@injectable()
export class DefaultUserService implements UserService {
  constructor(
    @inject(Component.UserModel) private readonly userModel: types.ModelType<UserEntity>,
    @inject(Component.Logger) private readonly logger: Logger
  ){}

  public async create(dto: CreateUserDTO, salt: string): Promise<DocumentType<UserEntity>> {
    const user = new UserEntity(dto);
    user.setPassword(dto.password, salt);

    const addedUser = await this.userModel.create(user);

    this.logger.info(`${MessageText.ADDED} ${user.email}`);

    return addedUser;
  }

  public async findById(id: string): Promise<DocumentType<UserEntity> | null> {
    return await this.userModel.findById({ id });
  }

  public async findByEmail(email: string): Promise<DocumentType<UserEntity> | null> {
    return await this.userModel.findOne({ email });
  }

  public async findOrCreate(dto: CreateUserDTO, salt: string): Promise<DocumentType<UserEntity>> {
    const existedUser = await this.findByEmail(dto.email);

    if(existedUser) {
      return existedUser;
    }

    return this.create(dto, salt);
  }
}
