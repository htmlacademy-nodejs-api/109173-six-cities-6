import { Expose } from 'class-transformer';

export class LoggedUserRDO {
  @Expose() name!: string;
  @Expose() email!: string;
  @Expose() token!: string;
}
