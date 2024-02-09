import { Ref, defaultClasses, getModelForClass, modelOptions, prop } from '@typegoose/typegoose';
import { Coordinate } from '../../types/coordinate.type.js';
import { OfferType, OfferTypes } from '../../types/offer-type.enum.js';
import { Cities, City } from '../../types/city-type.enum.js';
import { FacilitiesType, FacilitiesTypes } from '../../types/facilities-type.enum.js';
import { UserEntity } from '../user/user.entity.js';

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
export class OfferEntity extends defaultClasses.TimeStamps {
  @prop({
    minlength: [10, ErrorText.NAME_MIN],
    maxlength: [100, ErrorText.NAME_MAX],
    trim: true,
    required: true
  })
  public name!: string;

  @prop({
    minlength: 20,
    maxlength: 1024,
    trim: true,
    required: true
  })
  public description!: string;

  @prop({ required: true })
  public date!: string;

  @prop({
    type: () => String,
    enum: {
      values: Cities,
      message: ErrorText.ENUM,
    },
    required: true
  })
  public city!: City;

  @prop({ required: true })
  public previewImage!: string;

  @prop({
    type: () => [String],
    validate: [
      (val: string[]) => val.length >= 6,
      ErrorText.IMAGES_COUNT
    ]
  })
  public images!: string[];

  @prop({ required: true })
  public isPremium!: boolean;

  @prop({ required: true })
  public isFavorite!: boolean;

  @prop({
    min: 1,
    max: 5,
    required: true
  })
  public rating!: number;

  @prop({
    type: () => String,
    enum: {
      values: OfferTypes,
      message: ErrorText.ENUM,
    },
    required: true
  })
  public type!: OfferType;

  @prop({
    min: [1, ErrorText.ROOMS_MIN],
    max: [8, ErrorText.ROOMS_MAX],
    required: true
  })
  public rooms!: number;

  @prop({
    min: [1, ErrorText.GUESTS_MIN],
    max: [10, ErrorText.GUESTS_MAX],
    required: true
  })
  public guests!: number;

  @prop({
    min: [100, ErrorText.PRICE_MIN],
    max: [100000, ErrorText.PRICE_MAX],
    required: true
  })
  public price!: number;

  @prop({
    type: () => [String],
    enum: {
      values: FacilitiesTypes,
      message: ErrorText.ENUM,
    },
    required: true
  })
  public facilities!: FacilitiesType[];

  @prop({
    type: () => String,
    ref: () => UserEntity,
    _id: false,
    required: true,
  })
  public userId!: Ref<UserEntity>;

  @prop({
    default: 0
  })
  public commentCount!: number;

  @prop({ required: true })
  public coordinates!: Coordinate;
}

export const OfferModel = getModelForClass(OfferEntity);
