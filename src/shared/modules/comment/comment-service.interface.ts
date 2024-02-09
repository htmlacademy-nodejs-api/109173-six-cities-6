import { DocumentType } from '@typegoose/typegoose';
import { CommentEntity } from './comment.entity.js';
import { City } from '../../types/city-type.enum.js';
import { CreateCommentDTO } from './dto/create-comment.dto.js';

export type CommentDoc = DocumentType<CommentEntity>;
export type FoundComment = Promise<DocumentType<CommentEntity> | null>;
export type FoundComments = Promise<DocumentType<CommentEntity>[] | null>;

export interface CommentServise {
  create(offerId: string): Promise<CommentDoc>;
  updateById(id: number, dto: CreateCommentDTO): FoundComment
  deleteById(id: number): FoundComment
  find(city: City, commentsCount: number): FoundComments;
  findById(id: string): FoundComment
  findOrCreate(dto: CreateCommentDTO): FoundComment
}
