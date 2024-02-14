import { Expose } from 'class-transformer';

export class UserRDO {
  @Expose() name!: string;
  @Expose() email!: string;
  @Expose() avatarUrl!: string;
  @Expose() isPro!: boolean;
  @Expose() favoriteOffers!: string[];
}
