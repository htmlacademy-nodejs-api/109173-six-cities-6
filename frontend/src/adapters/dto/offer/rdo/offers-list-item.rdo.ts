import { City, OfferType } from '../dto/create-offer.dto';

export class OffersListItemRDO {
  public id!: string;
  public name!: string;
  public date!: string;
  public city!: City;
  public previewImage!: string;
  public isPremium!: boolean;
  public isFavorite!: boolean;
  public type!: OfferType;
  public price!: number;
  public commentCount!: number;
}
