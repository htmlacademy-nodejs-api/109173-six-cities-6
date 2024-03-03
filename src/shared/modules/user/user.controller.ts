import { inject, injectable } from 'inversify';

import { Logger } from '../../libs/logger/logger.interface.js';
import { Component } from '../../types/component.enum.js';
import { Request, Response } from 'express';
import { RequestBody, RequestParams } from '../../libs/rest/types/request.type.js';
import { HttpMethod } from '../../libs/rest/types/http-method.enum.js';
import { HttpError } from '../../libs/rest/errors/http-error.js';
import { StatusCodes } from 'http-status-codes';

import { BaseController } from '../../libs/rest/controller/base-controller.abstract.js';
import { UserService } from './user-service.interface.js';
import { RestConfig } from '../../libs/config/rest.config.js';
import { AuthService } from '../auth/auth-service.interface.js';

import { ControllerAdditionalInterface } from '../../libs/rest/controller/controller-additional.interface.js';
import { UploadFilesMiddleware } from '../../libs/rest/middleware/upload-files.middleware.js';
import { ValidateDTOMiddleware } from '../../libs/rest/middleware/validate-dto.middleware.js';
import { PrivateRouteMiddleware } from '../../libs/rest/middleware/private-route.middleware.js';
import { ValidateObjectIdMiddleware } from '../../libs/rest/middleware/validate-objectid.middleware.js';

import { ParamsUserId } from '../../libs/rest/types/params-userid.type .js';
import { ParamsOfferId } from '../../libs/rest/types/params-offerid.type.js';

import { LoggedUserRDO } from './rdo/logged-user.rdo.js';
import { UserRDO } from './rdo/user.rdo.js';
import { OffersListItemRDO } from '../offer/rdo/offers-list-item.rdo.js';
import { CheckUserStatusRDO } from './rdo/check-user-status.rdo.js';
import { LoginUserDTO } from './dto/login-user.dto.js';
import { CheckUserStatusDTO } from './dto/check-user-status.dto.js';
import { CreateUserDTO } from './index.js';
import { fillDTO } from '../../../utils/common.js';
import { GetOfferDTO } from '../offer/dto/get-offer.dto.js';
import { UserFavoritesRDO } from './rdo/user-favorites.rdo..js';

type CreateUserRequest = Request<RequestParams, RequestBody, CreateUserDTO>
type LoginUserRequest = Request<RequestParams, RequestBody, LoginUserDTO>;
type GetFavoriteOffersRequest = Request<ParamsUserId, RequestBody, GetOfferDTO>
type AddToFavoritesRequest = Request<ParamsOfferId, RequestBody, undefined>
type RemoveFromFavoritesRequest = Request<ParamsOfferId, RequestBody, undefined>

const MessageText = {
  INIT_CONTROLLER: 'Controller initialized'
} as const;

const ErrorText = {
  EXISTS: 'User is already exists',
  NOT_AUTHORIZED: 'User isn`t authorized',
  NOT_FOUND: 'User not found',
  NOT_IMPLEMENTED: 'Method hasn`t implemented yet',
  UPLOAD_AVATAR: 'Cant upload avatar for user'
} as const;

@injectable()
export class UserController extends BaseController implements ControllerAdditionalInterface {
  constructor(
    @inject(Component.Logger) protected readonly logger: Logger,
    @inject(Component.Config) protected readonly config: RestConfig,
    @inject(Component.UserService) private readonly userService: UserService,
    @inject(Component.AuthService) private readonly authService: AuthService
  ) {
    super(logger);

    this.registerRoutes();
    this.logger.info(`${MessageText.INIT_CONTROLLER}: ${this.getControllerName()}`);
  }

  public getControllerName() {
    return 'UserController';
  }

  public async registerRoutes() {
    this.addRoute({
      path: '/register',
      method: HttpMethod.POST,
      handler: this.create,
      middlewares: [ new ValidateDTOMiddleware(CreateUserDTO) ]
    });
    this.addRoute({
      path: '/login',
      method: HttpMethod.GET,
      handler: this.checkStatus,
      middlewares: [
        new PrivateRouteMiddleware(),
        new ValidateDTOMiddleware(CheckUserStatusDTO)
      ]
    });
    this.addRoute({
      path: '/login',
      method: HttpMethod.POST,
      handler: this.login,
      middlewares: [ new ValidateDTOMiddleware(LoginUserDTO) ]
    });
    this.addRoute({
      path: '/logout',
      method: HttpMethod.GET,
      handler: this.logout,
      middlewares: [ new PrivateRouteMiddleware() ]
    });
    this.addRoute({
      path: '/avatar',
      method: HttpMethod.POST,
      handler: this.uploadAvatar,
      middlewares: [
        new PrivateRouteMiddleware(),
        new UploadFilesMiddleware(this.config.get('UPLOAD_FILES_DIRECTORY'), 'user-avatar')
      ]
    });
    this.addRoute({ // Получение списка избранных предложений пользователя
      path: '/favorites',
      method: HttpMethod.GET,
      handler: this.getFavorites,
      middlewares: [ new PrivateRouteMiddleware() ]
    });
    this.addRoute({ // Добавление предложения в список избранного у пользователя
      path: '/favorites/:offerId',
      method: HttpMethod.POST,
      handler: this.addToFavorites,
      middlewares: [
        new PrivateRouteMiddleware(),
        new ValidateObjectIdMiddleware('offerId')
      ]
    });
    this.addRoute({ // Удаление предложения из списка избранного у пользователя
      path: '/favorites/:offerId',
      method: HttpMethod.DELETE,
      handler: this.removeFromFavorites,
      middlewares: [
        new PrivateRouteMiddleware(),
        new ValidateObjectIdMiddleware('offerId')
      ]
    });
  }

  public async create({ body }: CreateUserRequest, res: Response): Promise<void> {
    const isUserExists = await this.userService.findByEmail(body.email);

    if(isUserExists) {
      throw new HttpError(
        StatusCodes.CONFLICT,
        `${ErrorText.EXISTS}: ${body.email}`,
        this.getControllerName()
      );
    }

    const salt = this.config.get('SALT');
    const user = await this.userService.create(body, salt);
    const userRDO = fillDTO(UserRDO, user);

    this.created(res, userRDO);
  }

  public async checkStatus({ tokenPayload }: Request, _res: Response): Promise<void> {
    const { email } = tokenPayload;
    const user = await this.userService.findByEmail(email);

    if(!user) {
      throw new HttpError(
        StatusCodes.UNAUTHORIZED,
        `${ErrorText.NOT_AUTHORIZED}: ${email}`,
        this.getControllerName()
      );
    }

    this.ok(_res, fillDTO(CheckUserStatusRDO, user));
  }

  public async login({ body }: LoginUserRequest, _res: Response): Promise<void> {
    const user = await this.authService.check(body);
    const token = await this.authService.authenticate(user);
    const responseData = fillDTO(LoggedUserRDO, {
      email: user.email,
      token
    });

    this.ok(_res, responseData);
  }

  public async logout({ tokenPayload }: Request, _res: Response): Promise<void> {
    const { email } = tokenPayload;
    const user = await this.userService.findByEmail(email);

    if(!user) {
      throw new HttpError(
        StatusCodes.UNAUTHORIZED,
        `${ErrorText.NOT_FOUND}: ${email}`,
        this.getControllerName()
      );
    }

    // Заглушка
    throw new HttpError(
      StatusCodes.NOT_IMPLEMENTED,
      ErrorText.NOT_IMPLEMENTED,
      this.getControllerName()
    );
  }

  public async uploadAvatar(req: Request, res: Response): Promise<void > {
    const { userId } = req.tokenPayload;

    if(!req.file?.path) {
      throw new HttpError(
        StatusCodes.BAD_GATEWAY,
        `${ErrorText.UPLOAD_AVATAR}: ${userId}`,
        this.getControllerName()
      );
    }

    await this.userService.updateById(userId, { avatarUrl: req.file.filename});
    return this.created(res, req.file?.path);
  }

  public async getFavorites({ tokenPayload }: GetFavoriteOffersRequest, res: Response): Promise<void> {
    const { userId } = tokenPayload;

    const offers = await this.userService.getFavoriteOffers(userId);

    this.ok(res, fillDTO(OffersListItemRDO, offers));
  }

  public async addToFavorites({ params, tokenPayload }: AddToFavoritesRequest, res: Response): Promise<void> {
    const { offerId } = params;
    const { userId } = tokenPayload;
    const updatedUser = await this.userService.addToFavoritesIds(userId, offerId);

    this.ok(res, fillDTO(UserFavoritesRDO, updatedUser));
  }

  public async removeFromFavorites({ params, tokenPayload }: RemoveFromFavoritesRequest, res: Response): Promise<void> {
    const { offerId } = params;
    const { userId } = tokenPayload;
    const updatedUser = await this.userService.removeFromFavoritesIds(userId, offerId);

    this.ok(res, fillDTO(UserFavoritesRDO, updatedUser));
  }
}
