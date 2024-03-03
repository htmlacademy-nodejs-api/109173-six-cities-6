import { NextFunction, Request, Response } from 'express';
import { ExceptionFilter } from './exception-filter.interface.js';
import { inject, injectable } from 'inversify';
import { Component } from '../../../types/component.enum.js';
import { StatusCodes } from 'http-status-codes';
import { Logger } from '../../logger/logger.interface.js';
import { createErrorObject } from '../../../../utils/error.js';
import { AppError } from '../../../types/app-error.enum.js';

const MessageText = {
  INIT: 'App Exception Filter initialized'
} as const;

@injectable()
export class ApplicationExceptionFilter implements ExceptionFilter {
  constructor(
    @inject(Component.Logger) private readonly logger: Logger
  ){
    this.logger.info(MessageText.INIT);
  }

  public catch(error: Error, _req: Request, res: Response, _next: NextFunction): void {
    this.logger.error(error.message, error);

    res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json(createErrorObject(AppError.SERVICE_ERROR, error.message));
  }
}
