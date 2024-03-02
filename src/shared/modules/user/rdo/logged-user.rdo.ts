import { Expose } from 'class-transformer';

export class LoggedUserRDO {
  @Expose() email!: string;
  @Expose() token!: string;
}
