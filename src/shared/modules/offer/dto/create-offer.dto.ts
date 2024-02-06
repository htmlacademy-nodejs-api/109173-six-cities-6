import { City } from '../../../types/city-type.enum.js';
import { Coordinate } from '../../../types/coordinate.type.js';
import { FacilitiesType } from '../../../types/facilities-type.enum.js';
import { OfferType } from '../../../types/offer-type.enum.js';
import { Images } from '../../../types/offer.type.js';

export class CreateOfferDTO {
  public name!: string;
  public description!: string;
  public date!: string;
  public city!: City;
  public previewImage!: string;
  public images!: Images;
  public isPremium!: boolean;
  public isFavorite!: boolean;
  public rating!: number;
  public type!: OfferType;
  public rooms!: number;
  public guests!: number;
  public price!: number;
  public facilities!: FacilitiesType[];
  public userId!: string;
  public commentCount!: number;
  public coordinates!: Coordinate;
}
