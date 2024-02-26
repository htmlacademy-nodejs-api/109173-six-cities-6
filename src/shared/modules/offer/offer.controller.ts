import { inject, injectable } from 'inversify';
import { Component } from '../../types/component.enum.js';
import { Logger } from '../../libs/logger/logger.interface.js';

import { BaseController } from '../../libs/rest/controller/base-controller.abstract.js';
import { FoundOffer, OfferService } from './offer-service.interface.js';
import { CommentService } from '../comment/comment-service.interface.js';
import { UserService } from '../user/user-service.interface.js';

import { StatusCodes } from 'http-status-codes';
import { HttpMethod } from '../../libs/rest/types/http-method.enum.js';
import { HttpError } from '../../libs/rest/error/http-error.js';
import { Request, Response } from 'express';
import { RequestBody, RequestParams } from '../../libs/rest/types/request.type.js';

import { City } from '../../types/city-type.enum.js';
import { ParamsCityName } from '../../libs/rest/types/params-cityName.type.js';
import { ParamsFavoriteStatus } from '../../libs/rest/types/params-favorite-status.type.js';
import { ParamsUserId } from '../../libs/rest/types/params-userid.type .js';
import { ParamsOfferId } from '../../libs/rest/types/params-offerid.type.js';

import { CreateOfferDTO } from './dto/create-offer.dto.js';
import { fillDTO } from '../../../utils/common.js';
import { OfferRDO } from './rdo/offer.rdo.js';
import { OffersListItemRDO } from './rdo/offers-list-item.rdo.js';
import { GetOfferDTO } from './dto/get-offer.dto.js';
import { OfferDetailRDO } from './rdo/offer-detail.rdo.js';
import { UpdateOfferDTO } from './dto/update-offer.dto.js';

import { ValidateObjectIdMiddleware } from '../../libs/rest/middleware/validate-objectid.middleware.js';
import { ControllerAdditionalInterface } from '../../libs/rest/controller/controller-additional.interface.js';
import { ValidateDTOMiddleware } from '../../libs/rest/middleware/validate-dto.middleware.js';
import { DocumentExistsMiddleware } from '../../libs/rest/middleware/document-exists.middleware.js';
import { PrivateRouteMiddleware } from '../../libs/rest/middleware/private-route.middleware.js';

const MessageText = {
  INIT_CONTROLLER: 'Controller initialized'
} as const;

const ErrorText = {
  NOT_FOUND: 'Offer with requested ID not found',
  CITY_NOT_FOUND: 'Not found premium offers for city',
  USER_NOT_FOUND: 'User with requested ID not found '
} as const;

type GetOfferRequest = Request<ParamsOfferId, RequestBody, GetOfferDTO>
type CreateOfferRequest = Request<RequestParams, RequestBody, CreateOfferDTO>;
type UpdateOfferRequest = Request<ParamsOfferId, RequestBody, UpdateOfferDTO>
type DeleteOfferRequest = Request<ParamsOfferId, RequestBody, GetOfferDTO>
type GetPremiumOffers = Request<ParamsCityName, RequestBody, GetOfferDTO>
type GetFavoriteOffers = Request<ParamsUserId, RequestBody, GetOfferDTO>
type ChangeFavoriteStatus = Request<ParamsFavoriteStatus, RequestBody, GetOfferDTO>

@injectable()
export class OfferController extends BaseController implements ControllerAdditionalInterface {
  constructor(
    @inject(Component.Logger) protected readonly logger: Logger,
    @inject(Component.OfferService) protected readonly offerService: OfferService,
    @inject(Component.CommentService) protected readonly commentService: CommentService,
    @inject(Component.UserService) protected readonly userService: UserService,
  ) {
    super(logger);

    this.registerRoutes();
    this.logger.info(`${MessageText.INIT_CONTROLLER}: ${this.getControllerName()}`);
  }

  public getControllerName(): string {
    return 'OfferController';
  }

  public registerRoutes() {
    this.addRoute({
      path: '/',
      method: HttpMethod.GET,
      handler: this.getList
    });
    this.addRoute({
      path: '/',
      method: HttpMethod.POST,
      handler: this.create,
      middlewares: [
        new PrivateRouteMiddleware(),
        new ValidateDTOMiddleware(CreateOfferDTO)
      ]
    });
    this.addRoute({
      path: '/favorites/',
      method: HttpMethod.GET,
      handler: this.getFavoritesByUserId,
      middlewares: [ new PrivateRouteMiddleware() ]
    });
    this.addRoute({
      path: '/favorites/:offerId/:status',
      method: HttpMethod.PATCH,
      handler: this.changeFavoriteStatus,
      middlewares: [
        new PrivateRouteMiddleware(),
        new ValidateObjectIdMiddleware('offerId'),
        new DocumentExistsMiddleware('offerId', this.offerService)
      ]
    });
    this.addRoute({
      path: '/premium/:cityName',
      method: HttpMethod.GET,
      handler: this.getPremiumByCityName
    });
    this.addRoute({
      path: '/:offerId',
      method: HttpMethod.GET,
      handler: this.getItem,
      middlewares: [
        new ValidateObjectIdMiddleware('offerId'),
        new DocumentExistsMiddleware('offerId', this.offerService)
      ]
    });
    this.addRoute({
      path: '/:offerId',
      method: HttpMethod.PATCH,
      handler: this.update,
      middlewares: [
        new PrivateRouteMiddleware(),
        new ValidateObjectIdMiddleware('offerId'),
        new ValidateDTOMiddleware(UpdateOfferDTO),
        new DocumentExistsMiddleware('offerId', this.offerService),
      ]
    });
    this.addRoute({
      path: '/:offerId',
      method: HttpMethod.DELETE,
      handler: this.deleteWithComments,
      middlewares: [
        new PrivateRouteMiddleware(),
        new ValidateObjectIdMiddleware('offerId'),
        new DocumentExistsMiddleware('offerId', this.offerService)
      ]
    });
  }

  public async getList({ query }: Request, res: Response): Promise<void> {
    const { limit } = query;
    const offersLimit = limit ? Number(limit) : undefined;
    const offers = await this.offerService.find(offersLimit);

    this.ok(res, fillDTO(OffersListItemRDO, offers));
  }

  public async getItem({ params }: GetOfferRequest, res: Response): Promise<void> {
    const { offerId } = params;
    const offer = await this.exists(offerId);

    this.ok(res, fillDTO(OfferDetailRDO, offer));
  }

  public async create({ body }: CreateOfferRequest, res: Response): Promise<void> {
    const offer = await this.offerService.create(body);

    this.created(res, fillDTO(OfferRDO, offer));
  }

  public async update({ body, params }: UpdateOfferRequest, res: Response): Promise<void> {
    const { offerId } = params;
    const updatedOffer = await this.offerService.updateById(offerId, body);

    this.ok(res, fillDTO(OfferRDO, updatedOffer));
  }

  public async delete({ params }: DeleteOfferRequest, res: Response): Promise<void> {
    const { offerId } = params;
    const offer = await this.exists(offerId as string);

    await this.offerService.deleteById(offerId);

    this.noContent(res, fillDTO(GetOfferDTO, offer));
  }

  public async deleteWithComments(req: GetOfferRequest, res: Response): Promise<void> {
    const { params }: GetOfferRequest = req;
    const { offerId } = params;
    const offer = await this.getItem(req, res);

    await this.offerService.deleteById(offerId);
    await this.commentService.deleteByOfferId(offerId);

    this.ok(res, offer);
  }

  public async getFavoritesByUserId({ tokenPayload }: GetFavoriteOffers, res: Response): Promise<void> {
    const { userId } = tokenPayload;
    const user = await this.userService.exists(userId);

    if(!user) {
      throw new HttpError(
        StatusCodes.NOT_FOUND,
        `${ErrorText.NOT_FOUND}: ${userId}`,
        this.getControllerName()
      );
    }

    const offers = await this.userService.getFavoriteOffers(userId);

    this.ok(res, fillDTO(OfferRDO, offers));
  }

  public async getPremiumByCityName({ params }: GetPremiumOffers, res: Response): Promise<void> {
    const { cityName } = params;
    const offers = await this.offerService.getPremiumByCity(cityName as City);

    if(!offers || offers.length <= 0) {
      throw new HttpError(
        StatusCodes.NOT_FOUND,
        `${ErrorText.CITY_NOT_FOUND}: ${cityName}`,
        this.getControllerName()
      );
    }

    this.ok(res, fillDTO(OfferRDO, offers));
  }

  public async changeFavoriteStatus({ params }: ChangeFavoriteStatus, res: Response): Promise<void> {
    const { offerId, status } = params;

    await this.exists(offerId);

    const updatedOffer = await this.offerService.changeFavoriteStatus(offerId, Number(status));

    this.ok(res, fillDTO(OfferDetailRDO, updatedOffer));
  }

  private async exists(offerId: string): FoundOffer {
    const offer = await this.offerService.findById(offerId);

    if(!offer) {
      throw new HttpError(
        StatusCodes.NOT_FOUND,
        `${ErrorText.NOT_FOUND}: ${offerId}`,
        this.getControllerName()
      );
    }

    return offer;
  }
}
