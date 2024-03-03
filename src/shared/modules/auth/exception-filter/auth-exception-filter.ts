import { inject, injectable } from 'inversify';
import { Request, Response, NextFunction } from 'express';
import { ExceptionFilter } from '../../../libs/rest/exception-filter/exception-filter.interface.js';
import { BaseUserException } from '../errors/base-user-exception.js';
import { Component } from '../../../types/component.enum.js';
import { Logger } from '../../../libs/logger/logger.interface.js';
import { AppError } from '../../../types/app-error.enum.js';
import { createErrorObject } from '../../../../utils/error.js';

const MessageText = {
  INIT: 'Auth Exception Filter initialized'
} as const;

const ErrorText = {
  AUTH: '[AuthException]'
};

@injectable()
export class AuthExceptionFilter implements ExceptionFilter {
  constructor(
    @inject(Component.Logger) private readonly logger: Logger
  ){
    this.logger.info(MessageText.INIT);
  }

  public catch(error: unknown, _req: Request, res: Response, next: NextFunction): void {
    if(!(error instanceof BaseUserException)) {
      return next(error);
    }

    this.logger.error(`${ErrorText.AUTH}: ${error.message}`, error);

    res
      .status(error.statusCode)
      .json(createErrorObject(AppError.AUTHENTICATION_ERROR, error.message));
  }
}
