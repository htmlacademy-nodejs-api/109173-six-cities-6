import { HttpError } from '../../../libs/rest/error/http-error.js';

export class BaseUserException extends HttpError {
  constructor(statusCode: number, message: string, detail?: string | undefined){
    super(statusCode, message, detail);
  }
}
