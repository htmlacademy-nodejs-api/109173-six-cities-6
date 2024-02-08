import 'reflect-metadata';
import { RestApplication } from './rest/rest.application.js';
import { Component } from './shared/types/component.enum.js';
import { Container } from 'inversify';
import { createRestContainer } from './rest/rest.container.js';
import { createOfferContainer } from './shared/modules/offer/offer.container.js';
import { createUserContainer } from './shared/modules/user/user.container.js';

async function bootstrap() {
  const container = Container.merge(
    createRestContainer(),
    createOfferContainer(),
    createUserContainer()
  );

  const restApplication = container.get<RestApplication>(Component.RestApplication);

  await restApplication.init();
}

bootstrap();
