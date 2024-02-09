import { Ref, defaultClasses, getModelForClass, modelOptions, prop } from '@typegoose/typegoose';
import { UserEntity } from '../user/user.entity.js';
import { OfferEntity } from '../offer/offer.entity.js';

// eslint-disable-next-line @typescript-eslint/no-unsafe-declaration-merging
export interface CommentEntity extends defaultClasses.Base {}

@modelOptions({
  schemaOptions: {
    collection: 'comments',
    timestamps: true
  }
})
// eslint-disable-next-line @typescript-eslint/no-unsafe-declaration-merging
export class CommentEntity extends defaultClasses.TimeStamps {
  @prop({
    minlength: 5,
    maxlength: 1024,
    required: true
  })
  public text!: string;

  @prop({
    min: 1,
    max: 5,
    required: true
  })
  public rating!: number;

  @prop({
    type: () => String,
    ref: () => UserEntity,
    _id: false,
    required: true,
  })
  public userId!: Ref<UserEntity>;

  @prop({
    type: () => String,
    ref: () => OfferEntity,
    _id: false,
    required: true,
  })
  public offerId!: Ref<OfferEntity>;
}

export const CommentModel = getModelForClass(CommentEntity);
