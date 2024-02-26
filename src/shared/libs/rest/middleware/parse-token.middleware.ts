import { Request, Response, NextFunction } from 'express';
import { Middleware } from './middleware.interface.js';
import { UserUnauthorizedException } from '../../../modules/auth/errors/user-unauthorized.exceprion.js';

export class ParseTokenMiddleware implements Middleware {
  getName(): string {
    return 'ParseTokenMiddleware';
  }

  execute(req: Request, res: Response, next: NextFunction): void {
    const { authorization } = req.headers;

    if(!authorization) {
      return next();
    }

    const [_, token] = authorization.split(' ');

    if(!token) {
      throw new UserUnauthorizedException();
    }
  }
}
