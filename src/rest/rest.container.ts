import { Container } from 'inversify';
import { Component } from '../shared/types/component.enum.js';
import { RestConfig } from '../shared/libs/config/rest.config.js';
import { Logger } from '../shared/libs/logger/logger.interface.js';
import { PinoLogger } from '../shared/libs/logger/pino.logger.js';

import { RestApplication } from './rest.application.js';
import { DatabaseClient } from '../shared/libs/database-client/database-client.interface.js';
import { MongoDatabaseClient } from '../shared/libs/database-client/mongo.database-client.js';

import { ExceptionFilter } from '../shared/libs/rest/exception-filter/exception-filter.interface.js';
import { ApplicationExceptionFilter } from '../shared/libs/rest/exception-filter/application.exception-filter.js';
import { HttpErrorExceptionFilter } from '../shared/libs/rest/exception-filter/http-error.exceprion-filter.js';
import { ValidationExceptionFilter } from '../shared/libs/rest/exception-filter/validation-exception-filter.js';
import { PathTransformer } from '../shared/libs/rest/transform/path-transformer.js';

export function createRestContainer(): Container {
  const container = new Container();

  container.bind<RestApplication>(Component.RestApplication).to(RestApplication).inSingletonScope();
  container.bind<RestConfig>(Component.Config).to(RestConfig).inSingletonScope();
  container.bind<Logger>(Component.Logger).to(PinoLogger).inSingletonScope();
  container.bind<DatabaseClient>(Component.DatabaseClient).to(MongoDatabaseClient).inSingletonScope();
  container.bind<PathTransformer>(Component.PathTransformer).to(PathTransformer).inSingletonScope();
  container.bind<ExceptionFilter>(Component.AppExceptionFilter).to(ApplicationExceptionFilter).inSingletonScope();
  container.bind<ExceptionFilter>(Component.HttpExceptionFilter).to(HttpErrorExceptionFilter).inSingletonScope();
  container.bind<ExceptionFilter>(Component.ValidationExceptionFilter).to(ValidationExceptionFilter).inSingletonScope();

  return container;
}
