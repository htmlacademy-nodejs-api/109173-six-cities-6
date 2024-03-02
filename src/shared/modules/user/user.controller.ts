import { inject, injectable } from 'inversify';
import { Logger } from '../../libs/logger/logger.interface.js';
import { BaseController } from '../../libs/rest/controller/base-controller.abstract.js';
import { Component } from '../../types/component.enum.js';
import { Request, Response } from 'express';
import { RequestBody, RequestParams } from '../../libs/rest/types/request.type.js';
import { HttpMethod } from '../../libs/rest/types/http-method.enum.js';
import { UserService } from './user-service.interface.js';
import { CreateUserDTO } from './index.js';
import { fillDTO } from '../../../utils/common.js';
import { UserRDO } from './rdo/user.rdo.js';
import { RestConfig } from '../../libs/config/rest.config.js';
import { HttpError } from '../../libs/rest/error/http-error.js';
import { StatusCodes } from 'http-status-codes';
import { CheckUserStatusDTO } from './dto/check-user-status.dto.js';
import { ControllerAdditionalInterface } from '../../libs/rest/controller/controller-additional.interface.js';
import { ValidateDTOMiddleware } from '../../libs/rest/middleware/validate-dto.middleware.js';
import { LoginUserDTO } from './dto/login-user.dto.js';
import { ParamsUserId } from '../../libs/rest/types/params-userid.type .js';
import { ValidateObjectIdMiddleware } from '../../libs/rest/middleware/validate-objectid.middleware.js';
import { DocumentExistsMiddleware } from '../../libs/rest/middleware/document-exists.middleware.js';
import { UploadFilesMiddleware } from '../../libs/rest/middleware/upload-files.middleware.js';
import { AuthService } from '../auth/auth-service.interface.js';
import { LoggedUserRDO } from './rdo/logged-user.rdo.js';
import { PrivateRouteMiddleware } from '../../libs/rest/middleware/private-route.middleware.js';

type CreateUserRequest = Request<RequestParams, RequestBody, CreateUserDTO>
type CheckStatusRequest = Request<RequestParams, RequestBody, CheckUserStatusDTO>
type LoginUserRequest = Request<RequestParams, RequestBody, LoginUserDTO>;

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
      method: HttpMethod.POST,
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

    this.ok(_res, fillDTO(LoggedUserRDO, user));
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

  public async logout({ body }: CheckStatusRequest, _res: Response): Promise<void> {
    const user = await this.userService.findByEmail(body.email);

    if(!user) {
      throw new HttpError(
        StatusCodes.UNAUTHORIZED,
        `${ErrorText.NOT_FOUND}: ${body.email}`,
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

    await this.userService.updateById(userId, { avatarUrl: req.file.path});
    return this.created(res, req.file?.path);
  }
}
