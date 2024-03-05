import { Expose } from 'class-transformer';

export class UserFavoritesRDO {
  @Expose() name!: string;
  @Expose() email!: string;
  @Expose() favoriteOffers!: string[];
}
