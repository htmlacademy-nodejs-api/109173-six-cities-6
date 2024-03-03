import { Request, Response, NextFunction } from 'express';
import { ExceptionFilter } from './exception-filter.interface.js';
import { inject, injectable } from 'inversify';
import { Component } from '../../../types/component.enum.js';
import { Logger } from 'pino';
import { HttpError } from '../errors/http-error.js';
import { StatusCodes } from 'http-status-codes';
import { AppError } from '../../../types/app-error.enum.js';
import { createErrorObject } from '../../../../utils/error.js';

const MessageText = {
  INIT: 'HTTP-Error Exception Filter initialized'
} as const;

const ErrorText = {
  HTTP: '[HTTPErrorException]'
};


@injectable()
export class HttpErrorExceptionFilter implements ExceptionFilter {
  constructor(
    @inject(Component.Logger) private readonly logger: Logger
  ){
    this.logger.info(MessageText.INIT);
  }

  catch(error: unknown, { path }: Request, res: Response, next: NextFunction): void {
    if(!(error instanceof HttpError)) {
      return next(error);
    }
    this.logger.error(`${ErrorText.HTTP}: ${path} - ${error.message}`, error);

    res
      .status(error.statusCode)
      .json(createErrorObject(AppError.COMMON_ERROR, error.message));
  }
}
