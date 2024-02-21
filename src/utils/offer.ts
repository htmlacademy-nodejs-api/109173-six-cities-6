import { DocumentType } from '@typegoose/typegoose';
import { TSVSettings } from '../shared/libs/tsv-settings.js';
import { CreateOfferDTO } from '../shared/modules/offer/dto/create-offer.dto.js';
import { City } from '../shared/types/city-type.enum.js';
import { FacilitiesType } from '../shared/types/facilities-type.enum.js';
import { OfferType } from '../shared/types/offer-type.enum.js';
import { Offer } from '../shared/types/offer.type.js';
import { UserEntity } from '../shared/modules/user/user.entity.js';

const {DELIMITER} = TSVSettings;

export function makeOffer(fileRow: string): Offer {
  const [
    name,
    description,
    date,
    offerCity,
    previewImage,
    images,
    isPremium,
    isFavorite,
    rating,
    offerType,
    rooms,
    guests,
    price,
    facilities,
    user,
    comments,
    coordinates
  ] = fileRow.trim().split(DELIMITER.PARAMS);

  const [userName, userEmail, userAvatar, userPassword, userIsPro] = user.split(DELIMITER.VALUES);
  const [latitude, longitude] = coordinates.split(DELIMITER.VALUES);
  const city = offerCity as City;
  const type = offerType as OfferType;

  return {
    name,
    description,
    date: new Date(date).toISOString(),
    city,
    previewImage,
    images: images.split(DELIMITER.VALUES) ?? [],
    isPremium: !!isPremium,
    isFavorite: !!isFavorite,
    rating: Number(rating),
    type,
    rooms: Number(rooms),
    guests: Number(guests),
    price: Number(price),
    facilities: facilities.split(DELIMITER.VALUES) as FacilitiesType[] ?? [],
    user: {
      name: userName,
      email: userEmail,
      avatarUrl: userAvatar,
      password: userPassword,
      isPro: !!userIsPro,
      favoriteOffers: [],
    },
    commentCount: comments.split(DELIMITER.VALUES).length ?? 0,
    coordinates: {latitude, longitude}
  };
}

export function adaptOfferToDB(offer: Offer, user: DocumentType<UserEntity>): CreateOfferDTO {
  const adaptedOffer = {
    name: offer.name,
    description: offer.description,
    date: offer.date,
    city: offer.city,
    previewImage: offer.previewImage,
    images: offer.images,
    isPremium: offer.isPremium,
    isFavorite: offer.isFavorite,
    rating: offer.rating,
    type: offer.type,
    rooms: offer.rooms,
    guests: offer.guests,
    price: offer.price,
    facilities: offer.facilities,
    userId: user.id,
    commentCount: offer.commentCount,
    coordinates: offer.coordinates
  };

  return adaptedOffer;
}
