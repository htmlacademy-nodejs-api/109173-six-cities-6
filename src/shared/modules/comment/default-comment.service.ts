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

  public async create(dto: CreateCommentDTO): Promise<CommentDoc> {
    return await this.commentModel.create(dto);
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

  public async find(city: City, commentsCount: number = DEFAULT_COMMENTS_COUNT): FoundComments {
    return await this.commentModel
      .find()
      .limit(commentsCount)
      .sort({ createdAt: SortType.DOWN })
      .exec();
  }

  public async findById(id: string): FoundComment {
    return await this.commentModel
      .findById({ id })
      .exec();
  }
}
