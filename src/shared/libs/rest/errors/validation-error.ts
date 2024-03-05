import { StatusCodes } from 'http-status-codes';
import { ValidationErrorField } from '../../../types/validation-error-field.type.js';
import { HttpError } from './http-error.js';

export class ValidationError extends HttpError {
  public details: ValidationErrorField[] = [];

  constructor(message: string, errors: ValidationErrorField[]) {
    super(StatusCodes.BAD_REQUEST, message);

    this.details = errors;
  }
}
