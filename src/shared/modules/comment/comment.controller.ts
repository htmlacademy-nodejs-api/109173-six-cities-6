import { BaseController } from '../../libs/rest/controller/base-controller.abstract.js';
import { Request, Response } from 'express';
import { inject, injectable } from 'inversify';

import { Component } from '../../types/component.enum.js';
import { CommentService } from './comment-service.interface.js';
import { Logger } from '../../libs/logger/logger.interface.js';

import { RequestBody, RequestParams } from '../../libs/rest/types/request.type.js';

import { CreateCommentDTO } from './dto/create-comment.dto.js';
import { fillDTO } from '../../../utils/common.js';
import { CommentRDO } from './rdo/comment.rdo.js';
import { HttpMethod } from '../../libs/rest/types/http-method.enum.js';

type CreateCommentRequest = Request<RequestParams, RequestBody, CreateCommentDTO>;

@injectable()
export class CommentController extends BaseController {
  constructor(
    @inject(Component.Logger) protected readonly logger: Logger,
    @inject(Component.CommentService) private readonly commentService: CommentService
  ) {
    super(logger);

    this.addRoute({ path: '/', method: HttpMethod.POST, handler: this.create});
  }

  public async create({ body }: CreateCommentRequest, res: Response) {
    const newComment = await this.commentService.create(body);

    this.ok(res, fillDTO(CommentRDO, newComment));
  }
}
