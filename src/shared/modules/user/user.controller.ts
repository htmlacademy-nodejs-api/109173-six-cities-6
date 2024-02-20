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

type CreateUserRequest = Request<RequestParams, RequestBody, CreateUserDTO>
type CheckStatusRequest = Request<RequestParams, RequestBody, CheckUserStatusDTO>

const MessageText = {
  INIT_CONTROLLER: 'Controller initialized'
} as const;

const ErrorText = {
  EXISTS: 'User is already exists',
  NOT_AUTHORIZED: 'User isn`t authorized',
  NOT_FOUND: 'User not found',
  NOT_IMPLEMENTED: 'Method hasn`t implemented yet'
} as const;

@injectable()
export class UserController extends BaseController implements ControllerAdditionalInterface {
  constructor(
    @inject(Component.Logger) protected readonly logger: Logger,
    @inject(Component.Config) protected readonly config: RestConfig,
    @inject(Component.UserService) private readonly userService: UserService
  ) {
    super(logger);

    this.registerRoutes();
    this.logger.info(`${MessageText.INIT_CONTROLLER}: ${this.getControllerName()}`);
  }

  public getControllerName() {
    return 'UserController';
  }

  public async registerRoutes() {
    this.addRoute({ path: '/register', method: HttpMethod.POST, handler: this.create });
    this.addRoute({ path: '/login', method: HttpMethod.GET, handler: this.checkStatus });
    this.addRoute({ path: '/login', method: HttpMethod.POST, handler: this.login });
    this.addRoute({ path: '/logout', method: HttpMethod.POST, handler: this.logout });
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

  public async checkStatus({ body }: CheckStatusRequest, res: Response): Promise<void> {
    const user = await this.userService.checkAuthStatus(body.email);

    if(!user) {
      throw new HttpError(
        StatusCodes.UNAUTHORIZED,
        `${ErrorText.NOT_AUTHORIZED}: ${body.email}`,
        this.getControllerName()
      );
    }

    this.ok(res, fillDTO(UserRDO, user));
  }

  public async login({ body }: CheckStatusRequest, _res: Response): Promise<void> {
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
}
