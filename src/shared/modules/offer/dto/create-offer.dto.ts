import {
  ArrayMinSize,
  IsArray,
  IsBoolean,
  IsDateString,
  IsIn,
  IsInt,
  IsMongoId,
  IsObject,
  IsString,
  Max,
  MaxLength,
  Min,
  MinLength,
} from 'class-validator';

import { citiesList, City } from '../../../types/city-type.enum.js';
import { facilitiesTypeList, FacilitiesType } from '../../../types/facilities-type.enum.js';
import { OfferType, offersTypeList } from '../../../types/offer-type.enum.js';
import { Images } from '../../../types/offer.type.js';
import { OfferProps } from '../offer.constant.js';
import { OfferErrorText } from './create-offer.messages.js';
import { Coordinate } from '../../../types/coordinate.type.js';

export class CreateOfferDTO {
  @MaxLength(OfferProps.name.MAX_LENGTH, { message: OfferErrorText.name.MAX })
  @MinLength(OfferProps.name.MIN_LENGTH, { message: OfferErrorText.name.MIN })
  @IsString()
  public name!: string;

  @MaxLength(OfferProps.description.MAX_LENGTH, { message: OfferErrorText.description.MAX })
  @MinLength(OfferProps.description.MIN_LENGTH, { message: OfferErrorText.description.MIN })
  @IsString()
  public description!: string;

  @IsDateString({}, { message: OfferErrorText.date.INVALID })
  public date!: string;

  @IsIn(citiesList, { message: OfferErrorText.city.INVALID })
  @IsString()
  public city!: City;

  @IsString({ message: OfferErrorText.previewImage.INVALID_URL })
  public previewImage!: string;

  @ArrayMinSize(OfferProps.images.MIN_COUNT, { message: OfferErrorText.images.MIN_COUNT })
  @IsString({ each: true })
  @IsArray()
  public images!: Images;

  @IsBoolean({ message: OfferErrorText.isPremium.INVALID_BOOL })
  public isPremium!: boolean;

  @IsBoolean({ message: OfferErrorText.isFavorite.INVALID_BOOL })
  public isFavorite!: boolean;

  @Max(OfferProps.rating.MAX, { message: OfferErrorText.rating.MAX })
  @Min(OfferProps.rating.MIN, { message: OfferErrorText.rating.MIN })
  @IsInt({ message: OfferErrorText.rating.NOT_INTEGER })
  public rating!: number;

  @IsIn(offersTypeList, { message: OfferErrorText.type.INVALID })
  @IsString()
  public type!: OfferType;

  @IsInt({ message: OfferErrorText.rooms.NOT_INTEGER })
  @Max(OfferProps.rooms.MAX, { message: OfferErrorText.rooms.MAX })
  @Min(OfferProps.rooms.MIN, { message: OfferErrorText.rooms.MIN })
  public rooms!: number;

  @Max(OfferProps.guests.MAX, { message: OfferErrorText.guests.MAX })
  @Min(OfferProps.guests.MIN, { message: OfferErrorText.guests.MIN })
  @IsInt({ message: OfferErrorText.guests.NOT_INTEGER })
  public guests!: number;

  @Max(OfferProps.price.MAX, { message: OfferErrorText.price.MAX })
  @Min(OfferProps.price.MIN, { message: OfferErrorText.price.MIN })
  @IsInt({ message: OfferErrorText.price.NOT_INTEGER })
  public price!: number;

  @IsIn(facilitiesTypeList, { each: true, message: OfferErrorText.facilities.INVALID })
  @IsString({ each: true })
  @IsArray()
  public facilities!: FacilitiesType[];

  @IsMongoId({ message: OfferErrorText.userId.INVALID_ID })
  public userId!: string;

  @IsInt({ message: OfferErrorText.commentCount.NOT_INTEGER })
  public commentCount!: number;

  @IsObject({ message: OfferErrorText.coordinates.NOT_OBJECT })
  @IsString({ each: true })
  public coordinates!: Coordinate;
}
