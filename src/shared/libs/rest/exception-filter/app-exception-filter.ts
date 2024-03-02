import { NextFunction, Request, Response } from 'express';
import { ExceptionFilter } from './exception-filter.interface.js';
import { inject, injectable } from 'inversify';
import { Component } from '../../../types/component.enum.js';
import { StatusCodes } from 'http-status-codes';
import { Logger } from '../../logger/logger.interface.js';
import { HttpError } from '../error/http-error.js';

const MessageText = {
  INIT: 'App Exception Filter initialized'
} as const;

@injectable()
export class AppExceptionFilter implements ExceptionFilter {
  constructor(
    @inject(Component.Logger) private readonly logger: Logger
  ){
    this.logger.info(MessageText.INIT);
  }

  private handleHttpError(error: HttpError, _req: Request, res: Response, _next: NextFunction) {
    this.logger.error(`[${error.detail}]: ${error.statusCode} - ${error.message}`, error);

    res
      .status(error.statusCode)
      .json({ error: error.message });
  }

  private handleOtherError(error: Error, _req: Request, res: Response, _next: NextFunction) {
    this.logger.error(error.message, error);

    res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ error: error.message });
  }

  public catch(error: Error | HttpError, _req: Request, res: Response, _next: NextFunction): void {
    if(error instanceof HttpError) {
      return this.handleHttpError(error, _req, res, _next);
    }

    return this.handleOtherError(error, _req, res, _next);
  }
}
