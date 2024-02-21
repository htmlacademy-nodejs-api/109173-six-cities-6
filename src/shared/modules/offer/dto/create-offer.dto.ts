import {
  ArrayMinSize,
  IsBoolean,
  IsDateString,
  IsIn,
  IsInt,
  IsMongoId,
  IsObject,
  IsUrl,
  MaxLength,
  MinLength,
} from 'class-validator';

import { citiesList, City } from '../../../types/city-type.enum.js';
import { Coordinate } from '../../../types/coordinate.type.js';
import { facilitiesTypeList, FacilitiesType } from '../../../types/facilities-type.enum.js';
import { OfferType, offersTypeList } from '../../../types/offer-type.enum.js';
import { Images } from '../../../types/offer.type.js';
import { OfferProps } from '../offer.constant.js';
import { OfferErrorText } from './create-offer.messages.js';

export class CreateOfferDTO {
  @MinLength(OfferProps.name.MIN_LENGTH, { message: `${OfferErrorText.name.MIN}. Got: $value` })
  @MaxLength(OfferProps.name.MAX_LENGTH, { message: OfferErrorText.name.MAX })
  public name!: string;

  @MinLength(OfferProps.description.MIN_LENGTH, { message: OfferErrorText.description.MIN })
  @MaxLength(OfferProps.description.MAX_LENGTH, { message: OfferErrorText.description.MAX })
  public description!: string;

  @IsDateString({}, { message: OfferErrorText.date.INVALID })
  public date!: string;

  @IsIn(citiesList, { message: OfferErrorText.city.INVALID })
  public city!: City;

  @IsUrl({}, { message: OfferErrorText.previewImage.INVALID_URL })
  public previewImage!: string;

  @ArrayMinSize(OfferProps.images.MIN_COUNT, { message: OfferErrorText.images.MIN_COUNT })
  public images!: Images;

  @IsBoolean({ message: OfferErrorText.isPremium.INVALID_BOOL })
  public isPremium!: boolean;

  @IsBoolean({ message: OfferErrorText.isFavorite.INVALID_BOOL })
  public isFavorite!: boolean;

  @IsInt({ message: OfferErrorText.rating.NOT_INTEGER })
  @MinLength(OfferProps.rating.MIN, { message: OfferErrorText.rating.MIN })
  @MaxLength(OfferProps.rating.MAX, { message: OfferErrorText.rating.MAX })
  public rating!: number;

  @IsIn(offersTypeList, { message: OfferErrorText.type.INVALID })
  public type!: OfferType;

  @IsInt({ message: OfferErrorText.rooms.NOT_INTEGER })
  @MinLength(OfferProps.rooms.MIN, { message: OfferErrorText.rooms.MIN })
  @MaxLength(OfferProps.rooms.MAX, { message: OfferErrorText.rooms.MAX })
  public rooms!: number;

  @IsInt({ message: OfferErrorText.guests.NOT_INTEGER })
  @MinLength(OfferProps.guests.MIN, { message: OfferErrorText.guests.MIN })
  @MaxLength(OfferProps.guests.MAX, { message: OfferErrorText.guests.MAX })
  public guests!: number;

  @IsInt({ message: OfferErrorText.price.NOT_INTEGER })
  @MinLength(OfferProps.price.MIN, { message: OfferErrorText.price.MIN })
  @MaxLength(OfferProps.price.MAX, { message: OfferErrorText.price.MAX })
  public price!: number;

  @IsIn(facilitiesTypeList, { each: true, message: OfferErrorText.facilities.INVALID })
  public facilities!: FacilitiesType[];

  @IsMongoId({ message: OfferErrorText.userId.INVALID_ID })
  public userId!: string;

  @IsInt({ message: OfferErrorText.commentCount.NOT_INTEGER })
  public commentCount!: number;

  @IsObject()
  public coordinates!: Coordinate;
}
