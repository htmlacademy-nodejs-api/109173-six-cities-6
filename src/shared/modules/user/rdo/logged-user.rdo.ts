import { Expose } from 'class-transformer';

export class LoggedUserRDO {
  @Expose() name!: string;
  @Expose() email!: string;
  @Expose() avatarUrl!: string;
  @Expose() isPro!: boolean;
}
