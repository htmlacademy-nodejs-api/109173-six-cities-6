import { Logger } from '../../logger/logger.interface.js';
import { Response, Router } from 'express';
import { Controller } from './controller.interface.js';
import { Route } from '../route/route.interface.js';
import { injectable } from 'inversify';
import asyncHandler from 'express-async-handler';
import { StatusCodes } from 'http-status-codes';

const DEFAULT_CONTENT_TYPE = 'application/json';

const MessageText = {
  ROUTE_REGISTERED: 'Route registered',
} as const;

@injectable()
export class BaseController implements Controller {
  private readonly _router: Router;

  constructor(
    protected readonly logger: Logger
  ) {
    this._router = Router();
  }

  // т.к. в интерфейсе мы не можем объявить приватное свойство, используем такой финт
  get router() {
    return this._router;
  }

  public getControllerName(): string {
    return 'BaseController';
  }

  public addRoute(route: Route): void {
    const wrappedAsyncHandler = asyncHandler(route.handler.bind(this));
    const middlewares = route.middlewares?.map((middleware) => asyncHandler(middleware.execute.bind(middleware)));
    const routeHandlers = middlewares ? [ ...middlewares, wrappedAsyncHandler ] : [ wrappedAsyncHandler ];

    this.router[route.method](route.path, routeHandlers);
    this.logger.info(`${MessageText.ROUTE_REGISTERED}: ${route.method.toUpperCase()} ${route.path}`);

  }

  public send<T>(res: Response, statusCode: number, data: T): void {
    res
      .contentType(DEFAULT_CONTENT_TYPE)
      .status(statusCode)
      .json(data);
  }

  public created<T>(res: Response, data: T): void {
    this.send(res, StatusCodes.CREATED, data);
  }

  public ok<T>(res: Response, data: T): void {
    this.send(res, StatusCodes.OK, data);
  }

  public noContent<T>(res: Response, data: T): void {
    this.send(res, StatusCodes.NO_CONTENT, data);
  }

  public badRequest<T>(res: Response, data: T): void {
    this.send(res, StatusCodes.BAD_REQUEST, data);
  }

  public unauthorized<T>(res: Response, data: T): void {
    this.send(res, StatusCodes.UNAUTHORIZED, data);
  }
}
