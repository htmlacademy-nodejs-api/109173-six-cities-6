import { Document, Schema, model } from 'mongoose';
import { Offer } from '../../types/offer.type.js';

export interface OfferDocument extends Offer, Document {
  createdAt: Date,
  updatedAt: Date,
}

const ErrorText = {
  NAME_MIN: 'Offer name must contain at least 10 symbol. Got {VALUE}',
  NAME_MAX: 'Offer name length mustn`t be more than 100 symbols. Got {VALUE}',
  DESCRIPTION_MIN: 'Description must contain at least 100 symbols. Got {VALUE}',
  DESCRIPTION_MAX: 'Description mustn`t contain more than 1024 symbols. Got {VALUE}',
  ENUM: '{VALUE} is not supported',
  IMAGES_COUNT: 'Offer images count must be 6. Got: {VALUE}',
  ROOMS_MIN: 'Offer must containt at least 1 room',
  ROOMS_MAX: 'Offer mustn`t contain more than 8 rooms',
  GUESTS_MIN: 'Offer must recieve at least 1 guest',
  GUESTS_MAX: 'Offer mustn`t recieve more than 10 guests',
  PRICE_MIN: 'Price value must be at least 100',
  PRICE_MAX: 'Price value mustn`t be mode than 100 000',
} as const;

const offerSchema = new Schema({
  name: {
    type: String,
    minlength: [10, ErrorText.NAME_MIN],
    maxlength: [100, ErrorText.NAME_MAX],
    required: true,
  },
  description: {
    type: String,
    minlength: 100,
    maxlength: 1024,
    required: true,
  },
  date: String,
  city: {
    type: String,
    enum: {
      values: ['Paris', 'Cologne', 'Brussels', 'Amsterdam', 'Hamburg', 'Dusseldorf'],
      message: ErrorText.ENUM,
    },
    required: true,
  },
  previewImage: {
    type: String,
    required: true
  },
  images: {
    type: String,
    min: [6, ErrorText.IMAGES_COUNT]
  },
  isPremium: {
    type: Boolean,
    required: true
  },
  isFavorite: {
    type: Boolean,
    required: true
  },
  rating: {
    type: Number,
    min: 1,
    max: 5,
    required: true
  },
  type: {
    type: String,
    enum: {
      values: ['apartment', 'house', 'room', 'hotel'],
      message: ErrorText.ENUM,
    },
    required: true
  },
  rooms: {
    type: Number,
    min: [1, ErrorText.ROOMS_MIN],
    max: [8, ErrorText.ROOMS_MAX],
    required: true
  },
  guests: {
    type: Number,
    min: [1, ErrorText.GUESTS_MIN],
    max: [10, ErrorText.GUESTS_MAX],
    required: true
  },
  price: {
    type: String,
    min: [100, ErrorText.PRICE_MIN],
    max: [100000, ErrorText.PRICE_MAX],
    required: true
  },
  facilities: {
    type: String,
    enum: {
      values: ['Breakfast', 'Air conditioning', 'Laptop', 'friendly workspace', 'Baby seat', 'Washer', 'Towels', 'Fridge'],
      message: ErrorText.ENUM,
    },
    required: true
  },
  author: String,
  comments: Number,
  coordinates: String
}, { timestamps: true });

export const OfferModel = model<OfferDocument>('User', offerSchema);
