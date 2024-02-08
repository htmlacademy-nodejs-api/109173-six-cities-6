import { City } from './city-type.enum.js';
import { Coordinate } from './coordinate.type.js';
import { FacilitiesType } from './facilities-type.enum.js';
import { OfferType } from './offer-type.enum.js';
import { User } from './user.type.js';

export type Images = string[];

export type Offer = {
  name: string,
  description: string,
  date: string,
  city: City,
  previewImage: string,
  images: Images,
  isPremium: boolean,
  isFavorite: boolean,
  rating: number,
  type: OfferType,
  rooms: number,
  guests: number,
  price: number,
  facilities: FacilitiesType[],
  user: User,
  commentCount: number,
  coordinates: Coordinate
}
