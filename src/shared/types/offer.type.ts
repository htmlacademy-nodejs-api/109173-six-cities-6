import { City } from './city.type.js';
import { Coordinate } from './coordinate.type.js';
import { OfferType } from './offer-type.js';

type Images = string[];

export type Offer = {
  name: string,
  description: string,
  date: string,
  city: City,
  previewImage: string,
  images: Images,
  isPremium: string,
  isFavorite: string,
  rating: string,
  type: OfferType,
  rooms: string,
  guests: string,
  price: string,
  facilities: string[],
  author: string,
  comments: string[] | [],
  coordinates: Coordinate
}
