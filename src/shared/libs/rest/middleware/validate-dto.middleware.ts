import { Request, Response, NextFunction } from 'express';
import { Middleware } from './middleware.interface.js';
import { ClassConstructor, plainToClass } from 'class-transformer';
import { validate } from 'class-validator';
import { getPrettyErrors } from '../../../../utils/error.js';
import { ValidationError } from '../errors/validation-error.js';

const ErrorText = {
  INVALID_DTO: 'Validation error'
} as const;

export class ValidateDTOMiddleware implements Middleware {
  constructor(private readonly dto: ClassConstructor<object>){}

  public getName(): string {
    return 'ValidateDTOObjectMiddleware';
  }

  public async execute({ body, path }: Request, _res: Response, next: NextFunction) {
    const dtoInstance = plainToClass(this.dto, body);
    const validationErrors = await validate(dtoInstance);

    if(validationErrors.length > 0) {
      const errorMessage = `${ErrorText.INVALID_DTO}: ${this.getName()} ${path}`;
      const prettifiedErrors = getPrettyErrors(validationErrors);

      throw new ValidationError(errorMessage, prettifiedErrors);
    }

    next();
  }
}
