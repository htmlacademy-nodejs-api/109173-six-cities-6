import { types } from '@typegoose/typegoose';
import { Container } from 'inversify';
import { CommentEntity, CommentModel } from './comment.entity.js';
import { Component } from '../../types/component.enum.js';
import { CommentService } from './comment-service.interface.js';
import { DefaultCommentService } from './default-comment.service.js';
import { Controller } from '../../libs/rest/controller/controller.interface.js';
import { CommentController } from './comment.controller.js';

export function createCommentContainer(): Container {
  const container = new Container();

  container.bind<types.ModelType<CommentEntity>>(Component.CommentModel).toConstantValue(CommentModel);
  container.bind<CommentService>(Component.CommentService).to(DefaultCommentService).inSingletonScope();
  container.bind<Controller>(Component.CommentController).to(CommentController).inSingletonScope();

  return container;
}
