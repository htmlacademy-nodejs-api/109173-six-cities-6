import { _cities } from '../../../types/city-type.enum.js';
import { _facilities } from '../../../types/facilities-type.enum.js';
import { _offerTypes } from '../../../types/offer-type.enum.js';
import { OfferProps } from '../offer.constant.js';

export const OfferErrorText = {
  name: {
    MIN: `Offer name must contain at least ${OfferProps.name.MIN_LENGTH} symbol`,
    MAX: `Offer name length mustn't be more than ${OfferProps.name.MAX_LENGTH} symbols`,
  },
  description: {
    MIN: `Description must contain at least ${OfferProps.description.MIN_LENGTH} symbols`,
    MAX: `Description mustn't contain more than ${OfferProps.description.MAX_LENGTH} symbols`
  },
  date: {
    INVALID: 'date - must be a valid ISO date',
  },
  city: {
    INVALID: `City name must be one of next values: ${_cities}`,
  },
  previewImage: {
    INVALID_URL: 'previewImage must contain a correct image URL',
  },
  images: {
    MIN_COUNT: `Offer must contain ${OfferProps.images.MIN_COUNT} or more images`
  },
  isPremium: {
    INVALID_BOOL: 'isPremium must be a valid Boolean value (true / false)'
  },
  isFavorite: {
    INVALID_BOOL: 'isFavorite must be a valid Boolean value (true / false)'
  },
  rating: {
    NOT_INTEGER: 'Rating must be an integer',
    MIN: `Rating must be not less than ${OfferProps.rating.MIN}`,
    MAX: `Rating must be not more than ${OfferProps.rating.MIN}`,
  },
  type: {
    INVALID: `Offer Type must be one of next values: ${_offerTypes}`,
  },
  rooms: {
    NOT_INTEGER: 'Rooms must be an integer',
    MIN: `Offer must contain at least ${OfferProps.rooms.MIN} room`,
    MAX: `Offer mustn't contain more than ${OfferProps.rooms.MAX} rooms`,
  },
  guests: {
    NOT_INTEGER: 'Guests must be an integer',
    MIN: `Offer must receive at least ${OfferProps.guests.MIN} guest`,
    MAX: `Offer mustn't receive more than ${OfferProps.guests.MAX} guests`,
  },
  price: {
    NOT_INTEGER: 'Price must be an integer',
    MIN: `Price value mustn't be less than ${OfferProps.price.MIN}`,
    MAX: `Price value mustn't be more than ${OfferProps.price.MAX}`,
  },
  facilities: {
    INVALID: `Facilities can contain only next values: ${_facilities}`,
  },
  userId: {
    INVALID_ID: 'UserId must contain a valid id',
  },
  commentCount: {
    NOT_INTEGER: 'Price must be an integer'
  },
  enum: {
    INVALID: '{VALUE} is not supported'
  },
} as const;
