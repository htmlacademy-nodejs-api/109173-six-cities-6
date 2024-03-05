import { Expose } from 'class-transformer';

export class UserFavoritesRDO {
  @Expose() id!: string;
  @Expose() name!: string;
  @Expose() email!: string;
  @Expose() favoriteOffers!: string[];
}
