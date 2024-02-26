import { StatusCodes } from 'http-status-codes';
import { BaseUserException } from './base-user-exception.js';

const ErrorText = {
  UNAUTHORIZED: 'User is not authorized'
} as const;

export class UserUnauthorizedException extends BaseUserException {
  constructor() {
    super(StatusCodes.UNAUTHORIZED, ErrorText.UNAUTHORIZED);
  }
}
