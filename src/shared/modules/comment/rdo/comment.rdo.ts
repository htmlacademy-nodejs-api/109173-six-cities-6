import { Expose } from 'class-transformer';

export class CommentRDO {
  @Expose() public text!: string;
  @Expose() public rating!: number;
  @Expose() public userId!: string;
  @Expose() public offerId!: string;
}
