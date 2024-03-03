import { Request, Response, NextFunction } from 'express';
import { inject, injectable } from 'inversify';
import { StatusCodes } from 'http-status-codes';
import { Logger } from 'pino';

import { Component } from '../../../types/component.enum.js';

import { ExceptionFilter } from './exception-filter.interface.js';
import { ValidationError } from '../errors/validation-error.js';

import { createErrorObject } from '../../../../utils/error.js';
import { AppError } from '../../../types/app-error.enum.js';

const MessageText = {
  INIT: 'Validation Exception Filter initialized'
} as const;

const ErrorText = {
  VALIDATION: '[ValidationException]'
};

@injectable()
export class ValidationExceptionFilter implements ExceptionFilter {
  constructor(
    @inject(Component.Logger) private readonly logger: Logger,
  ){
    this.logger.info(MessageText.INIT);
  }

  public catch(error: unknown, _req: Request, res: Response, next: NextFunction): void {
    if(!(error instanceof ValidationError)) {
      return next(error);
    }

    this.logger.error(`${ErrorText.VALIDATION}: ${error.message}`, error);

    error.details.forEach(({ property, messages }) => this.logger.warn(`[${property}] - ${messages}`));

    res
      .status(StatusCodes.BAD_REQUEST)
      .json(createErrorObject(AppError.VALIDATION_ERROR, error.message, error.details));
  }
}
