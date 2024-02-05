import { Container } from 'inversify';
import { Component } from '../../types/component.enum.js';
import { UserEntity, UserModel } from './user.entity.js';
import { types } from '@typegoose/typegoose';
import { UserService } from './user-service.interface.js';
import { DefaultUserService } from './default-user.service.js';

export function createUserContainer(): Container {
  const container = new Container();

  container.bind<types.ModelType<UserEntity>>(Component.OfferModel).toConstantValue(UserModel);
  container.bind<UserService>(Component.UserService).to(DefaultUserService).inSingletonScope();

  return container;
}
