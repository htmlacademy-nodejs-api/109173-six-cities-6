import { inject, injectable } from 'inversify';
import { CommentDoc, CommentService, FoundComment, FoundComments } from './comment-service.interface.js';
import { CreateCommentDTO } from './dto/create-comment.dto.js';
import { Component } from '../../types/component.enum.js';
import { CommentEntity } from './comment.entity.js';
import { types } from '@typegoose/typegoose';
import { SortType } from '../../types/sort-type.enum.js';
import { COMMENTS_COUNT } from './comment.constant.js';
import { DocumentExists } from '../../types/document-exista.interface.js';
import { Logger } from '../../libs/logger/logger.interface.js';

const MessageText = {
  ADDED: 'New comment successfully added. Comment ID:',
} as const;

@injectable()
export class DefaultCommentService implements CommentService, DocumentExists {
  constructor(
    @inject(Component.Logger) private readonly logger: Logger,
    @inject(Component.CommentModel) private readonly commentModel: types.ModelType<CommentEntity>
  ){}

  public getEntityName(): string {
    return 'Comments';
  }

  public async create(dto: CreateCommentDTO): Promise<CommentDoc> {
    const comment = await this.commentModel.create(dto);

    this.logger.info(`${MessageText.ADDED} ${comment.id}`);

    return comment;
  }

  public async updateById(id: number, dto: CreateCommentDTO): FoundComment {
    return await this.commentModel
      .findByIdAndUpdate(id, dto, { new: true })
      .exec();
  }

  public async deleteById(id: number): FoundComment {
    return await this.commentModel
      .findByIdAndDelete(id)
      .exec();
  }

  public async deleteByOfferId(offerId: string): Promise<void> {
    await this.commentModel
      .deleteMany({ offerId });
  }

  public async find(offerId: string, commentsCount: number = COMMENTS_COUNT): FoundComments {
    return await this.commentModel
      .find({ offerId })
      .limit(commentsCount)
      .sort({ createdAt: SortType.DOWN })
      .exec();
  }

  public async findById(id: string): FoundComment {
    return await this.commentModel
      .findById({ id })
      .exec();
  }

  public async exists(commentId: string): Promise<boolean> {
    const comment = await this.commentModel.exists({ _id: commentId });

    return comment !== null;
  }
}
