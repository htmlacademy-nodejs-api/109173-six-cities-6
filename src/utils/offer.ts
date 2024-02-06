import { TSVSettings } from '../shared/libs/tsv-settings.js';
import { City } from '../shared/types/city-type.enum.js';
import { FacilitiesType } from '../shared/types/facilities-type.enum.js';
import { OfferType } from '../shared/types/offer-type.enum.js';
import { Offer } from '../shared/types/offer.type.js';

const {DELIMITER} = TSVSettings;

export function makeOffer(fileRow: string): Offer | void {
  if(fileRow.startsWith('#')) {
    return;
  }

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
    },
    commentCount: comments.split(DELIMITER.VALUES).length ?? 0,
    coordinates: {latitude, longitude}
  };
}
