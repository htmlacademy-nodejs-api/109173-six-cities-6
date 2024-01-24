import { TSVSettings } from '../shared/libs/tsv-settings.js';
import { City } from '../shared/types/city.type.js';
import { OfferType } from '../shared/types/offer-type.js';
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
    author,
    comments,
    coordinates
  ] = fileRow.trim().split(DELIMITER.PARAMS);

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
    isPremium,
    isFavorite,
    rating,
    type,
    rooms,
    guests,
    price,
    facilities: facilities.split(DELIMITER.VALUES) ?? [],
    author,
    comments: comments.split(DELIMITER.VALUES) ?? [],
    coordinates: {latitude, longitude}
  };
}
