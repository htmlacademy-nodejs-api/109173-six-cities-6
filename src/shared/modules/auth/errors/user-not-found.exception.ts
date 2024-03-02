import { StatusCodes } from 'http-status-codes';
import { BaseUserException } from './base-user-exception.js';

const ErrorText = {
  USER_NOT_FOUND: 'User with passed data not found'
} as const;

export class UserNotFoundException extends BaseUserException {
  constructor() {
    super(StatusCodes.NOT_FOUND, ErrorText.USER_NOT_FOUND);
  }
}
