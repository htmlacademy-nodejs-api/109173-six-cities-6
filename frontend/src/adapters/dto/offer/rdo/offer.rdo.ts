import { City, Coordinate, FacilitiesType, Images, OfferType } from '../dto/create-offer.dto';

export class OfferRDO {
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
