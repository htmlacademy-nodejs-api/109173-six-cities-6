import { inject, injectable } from 'inversify';
import { City } from '../../types/city-type.enum.js';
import { CommentDoc, CommentServise, FoundComment, FoundComments } from './comment-service.interface.js';
import { CreateCommentDTO } from './dto/create-comment.dto.js';
import { Component } from '../../types/component.enum.js';
import { CommentEntity } from './comment.entity.js';
import { types } from '@typegoose/typegoose';
import { SortType } from '../../types/sort-type.enum.js';

const DEFAULT_COMMENTS_COUNT = 50;

@injectable()
export class DefaultCommentService implements CommentServise {
  constructor(
    @inject(Component.CommentModel) private readonly commentModel: types.ModelType<CommentEntity>
  ){}

  public create(offerId: string): Promise<CommentDoc> {

  }

  public updateById(id: number, dto: CreateCommentDTO): FoundComment {

  }

  public deleteById(id: number): FoundComment {

  }

  public async find(city: City, commentsCount: number = DEFAULT_COMMENTS_COUNT): FoundComments {
    return await this.commentModel
      .find()
      .limit(commentsCount)
      .sort({ createdAt: SortType.DOWN })
      .exec();
  }

  public findById(id: string): FoundComment {

  }

  public findOrCreate(dto: CreateCommentDTO): FoundComment {

  }
}
