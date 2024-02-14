import { Container } from 'inversify';
import { Component } from '../shared/types/component.enum.js';
import { RestConfig } from '../shared/libs/config/rest.config.js';
import { Logger } from '../shared/libs/logger/logger.interface.js';
import { PinoLogger } from '../shared/libs/logger/pino.logger.js';
import { RestApplication } from './rest.application.js';
import { DatabaseClient } from '../shared/libs/database-client/database-client.interface.js';
import { MongoDatabaseClient } from '../shared/libs/database-client/mongo.database-client.js';
import { Controller } from '../shared/libs/rest/controller/controller.interface.js';
import { UserController } from '../shared/modules/user/user.controller.js';

export function createRestContainer(): Container {
  const container = new Container();

  container.bind<RestApplication>(Component.RestApplication).to(RestApplication).inSingletonScope();
  container.bind<RestConfig>(Component.Config).to(RestConfig).inSingletonScope();
  container.bind<Logger>(Component.Logger).to(PinoLogger).inSingletonScope();
  container.bind<DatabaseClient>(Component.DatabaseClient).to(MongoDatabaseClient).inSingletonScope();
  container.bind<Controller>(Component.UserController).to(UserController).inSingletonScope();

  return container;
}
