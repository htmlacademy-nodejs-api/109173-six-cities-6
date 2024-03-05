import { Expose, Type } from 'class-transformer';
import { OfferType } from '../../../types/offer-type.enum.js';
import { City } from '../../../types/city-type.enum.js';

export class UserFavoritesOffersRDO {
  @Expose({ name: '_id'})
  @Type(() => String)
  public id!: string;

  @Expose() public name!: string;
  @Expose() public date!: string;
  @Expose() public city!: City;
  @Expose() public previewImage!: string;
  @Expose() public isPremium!: boolean;
  @Expose() public isFavorite!: boolean;
  @Expose() public type!: OfferType;
  @Expose() public price!: number;
  @Expose() public commentCount!: number;
}
