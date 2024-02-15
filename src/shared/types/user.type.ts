import { Offer } from './offer.type.js';

export type User = {
  name: string,
  email: string,
  avatarUrl: string,
  password: string,
  isPro: boolean,
  favoriteOffers: string[]
};

export type UserWithOffers = Omit<User, 'favoriteOffers'> & {
  favoriteOffers: Offer[]
};
