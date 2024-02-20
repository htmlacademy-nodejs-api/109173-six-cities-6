import { NextFunction, Request, Response } from 'express';
import { Middleware } from './middleware.interface.js';
import { Types } from 'mongoose';
import { HttpError } from '../error/http-error.js';
import { StatusCodes } from 'http-status-codes';

const ErrorText = {
  INVALID_ID: 'Requested MongoDB ObjectId is not valid'
} as const;

export class ValidateObjectIdMiddleware implements Middleware {
  constructor(private paramName: string) {}

  public getName(): string {
    return 'ValidateObjectIdMiddleware';
  }

  public execute({ params }: Request, res: Response, next: NextFunction) {
    const objectId = params[this.paramName];

    if(!Types.ObjectId.isValid(objectId)) {
      throw new HttpError(
        StatusCodes.BAD_REQUEST,
        `${ErrorText.INVALID_ID}: ${objectId}`,
        this.getName()
      );
    }

    return next();
  }
}
