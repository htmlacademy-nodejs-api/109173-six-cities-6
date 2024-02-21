import { Request, Response, NextFunction } from 'express';
import { Middleware } from './middleware.interface.js';
import { ClassConstructor, plainToClass } from 'class-transformer';
import { validate } from 'class-validator';
import { HttpError } from '../error/http-error.js';
import { StatusCodes } from 'http-status-codes';
import { getPrettyErrors } from '../../../../utils/error.js';

const ErrorText = {
  INVALID_DTO: 'Invalid DTO data'
} as const;

export class ValidateDTOMiddleware implements Middleware {
  constructor(private readonly dto: ClassConstructor<object>){}

  public getName(): string {
    return 'ValidateDTOObjectMiddleware';
  }

  public async execute({ body }: Request, _res: Response, next: NextFunction) {
    const dtoInstance = plainToClass(this.dto, body);
    const validationErrors = await validate(dtoInstance);

    if(validationErrors.length > 0) {
      const prettifiedErrors = getPrettyErrors(validationErrors);

      console.log(prettifiedErrors);

      throw new HttpError(
        StatusCodes.BAD_REQUEST,
        `${ErrorText.INVALID_DTO}: ${prettifiedErrors}`,
        this.getName()
      );
    }

    return next();
  }
}
