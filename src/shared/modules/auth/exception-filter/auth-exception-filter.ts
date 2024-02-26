import { inject, injectable } from 'inversify';
import { Request, Response, NextFunction } from 'express';
import { ExceptionFilter } from '../../../libs/rest/exception-filter/exception-filter.interface.js';
import { BaseUserException } from '../errors/base-user-exception.js';
import { Component } from '../../../types/component.enum.js';
import { Logger } from '../../../libs/logger/logger.interface.js';

const MODULE_NAME = 'AuthModule';

const MessageText = {
  INIT: 'Auth Exception Filter initialized'
} as const;

@injectable()
export class AuthExceptionFilter implements ExceptionFilter {
  constructor(
    @inject(Component.Logger) private readonly logger: Logger
  ){
    this.logger.info(MessageText.INIT);
  }

  public handleAuthError(error: BaseUserException, _req: Request, res: Response, _next: NextFunction) {
    this.logger.error(`[${MODULE_NAME}]: ${error.message}`, error);

    res
      .status(error.statusCode)
      .send({ error: error.message });
  }

  public catch(error: Error | BaseUserException, req: Request, res: Response, next: NextFunction): void {
    if(error instanceof BaseUserException) {
      return this.handleAuthError(error, req, res, next);
    }

    return next(error);
  }
}
