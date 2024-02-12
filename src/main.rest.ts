import 'reflect-metadata';
import { RestApplication } from './rest/rest.application.js';
import { Component } from './shared/types/component.enum.js';
import { Container } from 'inversify';
import { createRestContainer } from './rest/rest.container.js';
import { createOfferContainer } from './shared/modules/offer/offer.container.js';
import { createUserContainer } from './shared/modules/user/user.container.js';
import { createCommentContainer } from './shared/modules/comment/comment.container.js';
import { DefaultOfferService } from './shared/modules/offer/default-offer.service.js';

async function bootstrap() {
  const container = Container.merge(
    createRestContainer(),
    createOfferContainer(),
    createUserContainer(),
    createCommentContainer()
  );

  const restApplication = container.get<RestApplication>(Component.RestApplication);


  await restApplication.init();

  const os = container.get<DefaultOfferService>(Component.OfferService);

  console.log(await os.countRatingAndComments('65c3539f177a2ad3d529effc'));
}

bootstrap();
