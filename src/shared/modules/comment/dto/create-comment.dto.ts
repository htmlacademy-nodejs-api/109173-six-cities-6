import { IsMongoId, IsNumber, IsString, Max, MaxLength, Min, MinLength } from 'class-validator';
import { CommentProps } from '../comment.constant.js';
import { CommentErrorText } from './create-comment.messages.js';

export class CreateCommentDTO {
  @MaxLength(CommentProps.text.MAX_LENGTH, { message: CommentErrorText.text.MAX })
  @MinLength(CommentProps.text.MIN_LENGTH, { message: CommentErrorText.text.MIN })
  @IsString()
  public text!: string;

  @Max(CommentProps.rating.MAX, { message: CommentErrorText.rating.MAX })
  @Min(CommentProps.rating.MIN, { message: CommentErrorText.rating.MIN })
  @IsNumber()
  public rating!: number;

  @IsMongoId()
  public userId!: string;

  @IsMongoId()
  public offerId!: string;
}
