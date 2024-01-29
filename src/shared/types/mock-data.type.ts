import { City } from './city-type.enum.js';
import { FacilitiesType } from './facilities-type.enum.js';
import { OfferType } from './offer-type.enum.js';
import { User } from './user.type.js';

type MockCities = {
  name: City,
  latitude: string,
  longitude: string,
};
type MockOffer = {
  names: string[],
  descriptions: string[],
  cities: MockCities[],
  comments: [],
  previewImages: string[],
  photos: string[],
  type: OfferType[],
  facilities: FacilitiesType[],
}
type MockUsers = Record<string, User>;

export type MockData = {
  offer: MockOffer,
  users: MockUsers,
};