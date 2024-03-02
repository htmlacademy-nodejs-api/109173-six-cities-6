import { Request, Response, NextFunction } from 'express';
import { Middleware } from './middleware.interface.js';
import { UserUnauthorizedException } from '../../../modules/auth/errors/user-unauthorized.exception.js';

export class PrivateRouteMiddleware implements Middleware {
  getName(): string {
    return 'PrivateRouteMiddleware';
  }

  execute({ tokenPayload }: Request, res: Response, next: NextFunction): void {
    if(!tokenPayload) {
      throw new UserUnauthorizedException();
    }

    return next();
  }
}
