import 'reflect-metadata';
import { Container } from 'inversify';
import { RestApplication } from './rest/rest.application.js';
import { RestConfig } from './shared/libs/config/rest.config.js';
import { PinoLogger } from './shared/libs/logger/pino.logger.js';
import { Component } from './shared/types/component.enum.js';

function makeComponentsContainer() {
  const componentsContainer = new Container();
  componentsContainer
    .bind<RestApplication>(Component.RestApplication).to(RestApplication).inSingletonScope();
  componentsContainer
    .bind<PinoLogger>(Component.Logger).to(PinoLogger).inSingletonScope();
  componentsContainer
    .bind<RestConfig>(Component.Config).to(RestConfig).inSingletonScope();

  return componentsContainer;
}

async function bootstrap() {
  const container = makeComponentsContainer();

  const restApplication = container.get<RestApplication>(Component.RestApplication);

  await restApplication.init();
}

bootstrap();
