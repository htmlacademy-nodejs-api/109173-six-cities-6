import { UserRDO } from '../../../user/rdo/user.rdo';
import { City, Coordinate, FacilitiesType, Images, OfferType } from '../create-offer.dto';

export class OfferDetailRDO {
  public id!: string;
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
  public user!: UserRDO;
  public commentCount!: number;
  public coordinates!: Coordinate;
}
