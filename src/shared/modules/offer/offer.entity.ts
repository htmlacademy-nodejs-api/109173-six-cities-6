import { Ref, defaultClasses, getModelForClass, modelOptions, prop } from '@typegoose/typegoose';
import { Coordinate } from '../../types/coordinate.type.js';
import { OfferType, OfferTypes } from '../../types/offer-type.enum.js';
import { Cities, City } from '../../types/city-type.enum.js';
import { FacilitiesType, FacilitiesTypes } from '../../types/facilities-type.enum.js';
import { UserEntity } from '../user/user.entity.js';
import { OfferErrorText } from './dto/create-offer.messages.js';

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
    trim: true,
    required: true
  })
  public name!: string;

  @prop({
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
      message: OfferErrorText.enum.INVALID,
    },
    required: true
  })
  public city!: City;

  @prop({ required: true })
  public previewImage!: string;

  @prop({ type: () => [String] })
  public images!: string[];

  @prop({ required: true })
  public isPremium!: boolean;

  @prop({ required: true })
  public isFavorite!: boolean;

  @prop({ required: true })
  public rating!: number;

  @prop({
    type: () => String,
    enum: {
      values: OfferTypes,
      message: OfferErrorText.enum.INVALID,
    },
    required: true
  })
  public type!: OfferType;

  @prop({ required: true })
  public rooms!: number;

  @prop({ required: true })
  public guests!: number;

  @prop({ required: true })
  public price!: number;

  @prop({
    type: () => [String],
    enum: {
      values: FacilitiesTypes,
      message: OfferErrorText.enum.INVALID,
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
