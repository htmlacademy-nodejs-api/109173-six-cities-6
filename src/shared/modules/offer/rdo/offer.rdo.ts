import { Expose } from 'class-transformer';
import { City } from '../../../types/city-type.enum.js';
import { Coordinate } from '../../../types/coordinate.type.js';
import { FacilitiesType } from '../../../types/facilities-type.enum.js';
import { OfferType } from '../../../types/offer-type.enum.js';
import { Images } from '../../../types/offer.type.js';

export class OfferRDO {
  @Expose() public name!: string;
  @Expose() public description!: string;
  @Expose() public date!: string;
  @Expose() public city!: City;
  @Expose() public previewImage!: string;
  @Expose() public images!: Images;
  @Expose() public isPremium!: boolean;
  @Expose() public rating!: number;
  @Expose() public type!: OfferType;
  @Expose() public rooms!: number;
  @Expose() public guests!: number;
  @Expose() public price!: number;
  @Expose() public facilities!: FacilitiesType[];
  @Expose() public userId!: string;
  @Expose() public commentCount!: number;
  @Expose() public coordinates!: Coordinate;
}
