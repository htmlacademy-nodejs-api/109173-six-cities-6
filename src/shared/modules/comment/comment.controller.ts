import { Request, Response } from 'express';
import { inject, injectable } from 'inversify';
import { Component } from '../../types/component.enum.js';
import { Logger } from '../../libs/logger/logger.interface.js';

import { BaseController } from '../../libs/rest/controller/base-controller.abstract.js';
import { CommentService } from './comment-service.interface.js';
import { OfferService } from '../offer/offer-service.interface.js';

import { HttpMethod } from '../../libs/rest/types/http-method.enum.js';
import { RequestBody, RequestParams } from '../../libs/rest/types/request.type.js';

import { ParamsOfferId } from '../../libs/rest/types/params-offerid.type.js';

import { CreateCommentDTO } from './dto/create-comment.dto.js';
import { fillDTO } from '../../../utils/common.js';
import { CommentRDO } from './rdo/comment.rdo.js';

import { ValidateObjectIdMiddleware } from '../../libs/rest/middleware/validate-objectid.middleware.js';
import { ControllerAdditionalInterface } from '../../libs/rest/controller/controller-additional.interface.js';
import { ValidateDTOMiddleware } from '../../libs/rest/middleware/validate-dto.middleware.js';
import { DocumentExistsMiddleware } from '../../libs/rest/middleware/document-exists.middleware.js';
import { PrivateRouteMiddleware } from '../../libs/rest/middleware/private-route.middleware.js';

const MessageText = {
  INIT_CONTROLLER: 'Controller initialized'
} as const;

type CreateCommentRequest = Request<RequestParams, RequestBody, CreateCommentDTO>;
type GetCommentsRequest = Request<ParamsOfferId, RequestBody, CreateCommentDTO[]>

@injectable()
export class CommentController extends BaseController implements ControllerAdditionalInterface{
  constructor(
    @inject(Component.Logger) protected readonly logger: Logger,
    @inject(Component.CommentService) private readonly commentService: CommentService,
    @inject(Component.OfferService) private readonly offerService: OfferService
  ) {
    super(logger);

    this.registerRoutes();
    this.logger.info(`${MessageText.INIT_CONTROLLER}: ${this.getControllerName()}`);
  }

  public getControllerName(): string {
    return 'CommentController';
  }

  public registerRoutes() {
    this.addRoute({
      path: '/',
      method: HttpMethod.POST,
      handler: this.create,
      middlewares: [
        new PrivateRouteMiddleware(),
        new ValidateDTOMiddleware(CreateCommentDTO)
      ]
    });
    this.addRoute({
      path: '/:offerId',
      method: HttpMethod.GET,
      handler: this.getCommentsByOfferId,
      middlewares: [
        new ValidateObjectIdMiddleware('offerId'),
        new DocumentExistsMiddleware('offerId', this.offerService)
      ]
    });
  }

  public async create({ body, tokenPayload }: CreateCommentRequest, res: Response) {
    body.userId = tokenPayload.userId;

    const newComment = await this.commentService.create(body);
    const offerId = String(newComment.offerId);

    await this.offerService.incCommentsCount(offerId);
    await this.offerService.updateRatingAndComments(offerId);

    this.ok(res, fillDTO(CommentRDO, newComment));
  }

  public async getCommentsByOfferId({ params }: GetCommentsRequest, res: Response): Promise<void> {
    const { offerId } = params;
    const comments = await this.commentService.find(offerId);

    this.ok(res, fillDTO(CommentRDO, comments));
  }
}
