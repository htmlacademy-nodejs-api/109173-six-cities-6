import 'reflect-metadata';
import { Container } from 'inversify';
import { RestApplication } from './rest/rest.application.js';
import { RestConfig } from './shared/libs/config/rest.config.js';
import { PinoLogger } from './shared/libs/logger/pino.logger.js';
import { Component } from './shared/types/component.enum.js';
import { DatabaseClient } from './shared/libs/database-client/database-client.interface.js';
import { MongoDatabaseClient } from './shared/libs/database-client/mongo.database-client.js';
import { CreateUserDTO, DefaultUserService, UserModel } from './shared/modules/user/index.js';

function makeComponentsContainer() {
  const componentsContainer = new Container();
  componentsContainer
    .bind<RestApplication>(Component.RestApplication).to(RestApplication).inSingletonScope();
  componentsContainer
    .bind<PinoLogger>(Component.Logger).to(PinoLogger).inSingletonScope();
  componentsContainer
    .bind<RestConfig>(Component.Config).to(RestConfig).inSingletonScope();
  componentsContainer
    .bind<DatabaseClient>(Component.DatabaseClient).to(MongoDatabaseClient).inSingletonScope();

  return componentsContainer;
}

async function bootstrap() {
  const container = makeComponentsContainer();

  const restApplication = container.get<RestApplication>(Component.RestApplication);

  await restApplication.init();
}

bootstrap();
