import { DocumentType } from '@typegoose/typegoose';
import { CommentEntity } from './comment.entity.js';
import { CreateCommentDTO } from './dto/create-comment.dto.js';

export type CommentDoc = DocumentType<CommentEntity>;
export type FoundComment = Promise<DocumentType<CommentEntity> | null>;
export type FoundComments = Promise<DocumentType<CommentEntity>[] | null>;

export interface CommentService {
  create(dto: CreateCommentDTO): Promise<CommentDoc>;
  updateById(id: number, dto: CreateCommentDTO): FoundComment;
  deleteById(id: number): FoundComment;
  deleteByOfferId(offerId: string): Promise<void>;
  find(offerId: string, commentsCount?: number): FoundComments;
  findById(id: string): FoundComment;
}
