import { Container } from 'inversify';
import { Component } from '../../types/component.enum.js';
import { UserEntity, UserModel } from './user.entity.js';
import { types } from '@typegoose/typegoose';
import { DefaultUserService } from './default-user.service.js';
import { UserService } from './user-service.interface.js';
import { Controller } from '../../libs/rest/controller/controller.interface.js';
import { UserController } from './user.controller.js';

export function createUserContainer(): Container {
  const container = new Container();

  container.bind<types.ModelType<UserEntity>>(Component.UserModel).toConstantValue(UserModel);
  container.bind<UserService>(Component.UserService).to(DefaultUserService).inSingletonScope();
  container.bind<Controller>(Component.UserController).to(UserController);

  return container;
}
