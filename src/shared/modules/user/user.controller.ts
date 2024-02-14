import { inject, injectable } from 'inversify';
import { BaseController } from '../../libs/rest/controller/base-controller.abstract.js';
import { Component } from '../../types/component.enum.js';
import { PinoLogger } from '../../libs/logger/pino.logger.js';
import { Request, Response } from 'express';
import { HttpMethod } from '../../libs/rest/types/http-method.enum.js';
import { UserService } from './user-service.interface.js';

@injectable()
export class UserController extends BaseController {
  constructor(
    @inject(Component.Logger) protected readonly logger: PinoLogger,
    @inject(Component.UserService) private readonly userService: UserService
  ) {
    super(logger);

    this.addRoute({ path: '/', method: HttpMethod.GET, handler: this.checkStatus });
    this.addRoute({ path: '/register', method: HttpMethod.POST, handler: this.create });
    this.addRoute({ path: '/login', method: HttpMethod.POST, handler: this.login });
    this.addRoute({ path: '/logout', method: HttpMethod.POST, handler: this.logout });
  }

  public create(req: Request, res: Response): void {
    // Создание пользователя
  }

  public checkStatus(req: Request, res: Response): void {
    // Проверка статуса авторизации пользователя
  }

  public login(req: Request, res: Response): void {
    // Авторизация пользователя
  }

  public logout(req: Request, res: Response): void {
    // Разавторизация пользователя
  }
}
