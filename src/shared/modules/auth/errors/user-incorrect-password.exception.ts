import { StatusCodes } from 'http-status-codes';
import { BaseUserException } from './base-user-exception.js';

const ErrorText = {
  INCORRECT_DATA: 'Incorrect Email/Password'
} as const;

export class UserIncorrectPasswordException extends BaseUserException {
  constructor() {
    super(StatusCodes.NOT_FOUND, ErrorText.INCORRECT_DATA);
  }
}
