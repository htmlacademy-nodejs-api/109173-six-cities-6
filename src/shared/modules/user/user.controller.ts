import { inject, injectable } from 'inversify';
import { BaseController } from '../../libs/rest/controller/base-controller.abstract.js';
import { Component } from '../../types/component.enum.js';
import { PinoLogger } from '../../libs/logger/pino.logger.js';
import { Request, Response } from 'express';
import { HttpMethod } from '../../libs/rest/types/http-method.enum.js';
import { UserService } from './user-service.interface.js';
import { CreateUserDTO } from './index.js';
import { fillDTO } from '../../../utils/common.js';
import { UserRDO } from './rdo/user.rdo.js';
import { RestConfig } from '../../libs/config/rest.config.js';

type RequestParams = Record<string, unknown>;
type RequestBody = RequestParams;
type CreateUserRequest = Request<RequestParams, RequestBody, CreateUserDTO>

const MessageText = {
  INIT_CONTROLLERS: 'UserController initialized',
} as const;

@injectable()
export class UserController extends BaseController {
  constructor(
    @inject(Component.Logger) protected readonly logger: PinoLogger,
    @inject(Component.Config) protected readonly config: RestConfig,
    @inject(Component.UserService) private readonly userService: UserService
  ) {
    super(logger);

    this.addRoute({ path: '/', method: HttpMethod.GET, handler: this.checkStatus });
    this.addRoute({ path: '/register', method: HttpMethod.POST, handler: this.create });
    this.addRoute({ path: '/login', method: HttpMethod.POST, handler: this.login });
    this.addRoute({ path: '/logout', method: HttpMethod.POST, handler: this.logout });

    this.logger.info(MessageText.INIT_CONTROLLERS);
  }

  public async create({ body }: CreateUserRequest, res: Response): Promise<UserRDO | void> {
    const isUserExists = await this.userService.findByEmail(body.email);

    if(isUserExists) {
      throw new Error(`User with email "${body.email}" is already exists`);
    }

    const salt = this.config.get('SALT');
    const user = await this.userService.create(body, salt);
    const userRDO = fillDTO(UserRDO, user);

    return this.created(res, userRDO);
  }

  public checkStatus({ body }: CreateUserRequest, res: Response): void {
    // Проверка статуса авторизации пользователя
  }

  public login(req: Request, res: Response): void {
    // Авторизация пользователя
  }

  public logout(req: Request, res: Response): void {
    // Разавторизация пользователя
  }
}
