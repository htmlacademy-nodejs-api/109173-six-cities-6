import 'reflect-metadata';
import { RestApplication } from './rest/rest.application.js';
import { Component } from './shared/types/component.enum.js';
import { Container } from 'inversify';
import { createRestContainer } from './rest/rest.container.js';
import { createOfferContainer } from './shared/modules/offer/offer.container.js';
import { createUserContainer } from './shared/modules/user/user.container.js';
import { CreateUserDTO, UserService } from './shared/modules/user/index.js';
import { CreateOfferDTO } from './shared/modules/offer/dto/create-offer.dto.js';
import { OfferService } from './shared/modules/offer/offer-service.interface.js';

async function bootstrap() {
  const container = Container.merge(
    createRestContainer(),
    createOfferContainer(),
    createUserContainer()
  );

  const restApplication = container.get<RestApplication>(Component.RestApplication);

  await restApplication.init();

  const userService = container.get<UserService>(Component.UserService);
  const offerService = container.get<OfferService>(Component.OfferService);


  // TEST BLOCK
  const user = new CreateUserDTO();
  user.avatarUrl = 'avatar/link/image.png';
  user.name = 'Oppenhamer';
  user.email = '05jule@trinity.ru';
  user.isPro = true;
  user.password = '1598hgwf9h';

  const newUser = await userService.findOrCreate(user, 'sometestsalt');

  console.log('NEW USER SUCCESSFULLY ADDED. USER ID: ', newUser.id);

  const offer = new CreateOfferDTO();
  offer.name = 'Shale at the mountain';
  offer.description = `Lorem ipsum dolor sit amet consectetur adipisicing elit.
  Quis facilis ea adipisci ex numquam vel, itaque, quae laudantium dolorum, tenetur
  reiciendis debitis laborum nihil quasi? Vero suscipit, in enim reprehenderit nulla
  esse amet ipsam. Rerum ipsum deserunt facilis, ea magnam quam maiores maxime blanditiis
  magni vero amet iste sunt, delectus id! Neque ullam at fugiat deleniti nulla velit libero cum,
  amet debitis rem. Similique sit, excepturi maxime explicabo nemo praesentium omnis non molestiae
  ut vero perspiciatis id, fugit rerum. Reiciendis a minus, aliquid impedit nobis tempora voluptatibus
  fugiat repellendus dolores, corporis alias! Laudantium, doloremque. Voluptatum minus qui enim quibusdam sed!`;
  offer.date = new Date().toISOString();
  offer.previewImage = '/some/test/url,jpg';
  offer.city = 'Amsterdam';
  offer.images = ['image_one', 'image_2', 'image_3', 'image_4', 'image_5', 'image_6'];
  offer.isPremium = true;
  offer.isFavorite = false;
  offer.rating = 4;
  offer.type = 'hotel';
  offer.rooms = 8;
  offer.guests = 10;
  offer.price = 98000;
  offer.facilities = ['Baby seat', 'Breakfast', 'Washer'];
  offer.user = newUser.id;
  offer.commentCount = 10;
  offer.coordinates = {
    latitude: '482-0495',
    longitude: '346-43643'
  };

  const newOFfer = await offerService.create(offer);
  console.log('--------------------- OFFER: ', newOFfer);
}

bootstrap();
