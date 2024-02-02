import { defaultClasses, getModelForClass, modelOptions, prop } from '@typegoose/typegoose';
import { Offer } from '../../types/offer.type.js';
import { Coordinate } from '../../types/coordinate.type.js';
import { OfferType } from '../../types/offer-type.enum.js';
import { City } from '../../types/city-type.enum.js';

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

// eslint-disable-next-line @typescript-eslint/no-unsafe-declaration-merging
export interface OfferEntity extends defaultClasses.Base {}

@modelOptions({
  schemaOptions: {
    collection: 'offers',
    timestamps: true
  }
})
// eslint-disable-next-line @typescript-eslint/no-unsafe-declaration-merging
export class OfferEntity extends defaultClasses.TimeStamps implements Offer {
  @prop({ minlength: [10, ErrorText.NAME_MIN], maxlength: [100, ErrorText.NAME_MAX], required: true })
  public name: string;

  @prop({ minlength: 100, maxlength: 1024, required: true })
  public description: string;

  @prop({})
  public date: string;

  @prop({
    enum: {
      values: ['Paris', 'Cologne', 'Brussels', 'Amsterdam', 'Hamburg', 'Dusseldorf'],
      message: ErrorText.ENUM,
    },
    required: true
  })
  public city: City;

  @prop({ required: true })
  public previewImage: string;

  @prop({ min: [6, ErrorText.IMAGES_COUNT] })
  public images: string[];

  @prop({ required: true })
  public isPremium: string;

  @prop({ required: true })
  public isFavorite: string;

  @prop({ min: 1, max: 5, required: true })
  public rating: string;

  @prop({
    enum: {
      values: ['apartment', 'house', 'room', 'hotel'],
      message: ErrorText.ENUM,
    },
    required: true
  })
  public type: OfferType;

  @prop({ min: [1, ErrorText.ROOMS_MIN], max: [8, ErrorText.ROOMS_MAX], required: true })
  public rooms: string;

  @prop({ min: [1, ErrorText.GUESTS_MIN],max: [10, ErrorText.GUESTS_MAX], required: true })
  public guests: string;

  @prop({ min: [100, ErrorText.PRICE_MIN], max: [100000, ErrorText.PRICE_MAX], required: true })
  public price: string;

  @prop({
    enum: {
      values: ['Breakfast', 'Air conditioning', 'Laptop', 'friendly workspace', 'Baby seat', 'Washer', 'Towels', 'Fridge'],
      message: ErrorText.ENUM,
    },
    required: true
  })
  public facilities: string[];

  @prop({})
  public author: string;

  @prop({})
  public comments: string[];

  @prop({})
  public coordinates: Coordinate;


  constructor(offerData: Offer) {
    super();

    this.name = offerData.name;
    this.description = offerData.description;
    this.date = offerData.date;
    this.city = offerData.city;
    this.previewImage = offerData.previewImage;
    this.images = offerData.images;
    this.isPremium = offerData.isPremium;
    this.isFavorite = offerData.isFavorite;
    this.rating = offerData.rating;
    this.type = offerData.type;
    this.rooms = offerData.rooms;
    this.guests = offerData.guests;
    this.price = offerData.price;
    this.facilities = offerData.facilities;
    this.author = offerData.author;
    this.comments = offerData.comments;
    this.coordinates = offerData.coordinates;
  }
}

export const OfferModel = getModelForClass(OfferEntity);
