import { Request, Response, NextFunction } from 'express';
import { Middleware } from './middleware.interface.js';
import { UserUnauthorizedException } from '../../../modules/auth/errors/user-unauthorized.exceprion.js';
import { HttpError } from '../error/http-error.js';
import { StatusCodes } from 'http-status-codes';
import { jwtVerify } from 'jose';
import { makeSecretKey } from '../../../../utils/encrypt.js';
import { TokenPayload } from '../../../types/token-payload.type.js';

const ErrorText = {
  INVALID_TOKEN: 'Passed Token is not valid'
} as const;

export class ParseTokenMiddleware implements Middleware {
  getName(): string {
    return 'ParseTokenMiddleware';
  }

  isTokenPayload(payload: unknown): payload is TokenPayload {
    return (
      (typeof payload === 'object' && payload !== null) &&
      ('id' in payload && typeof payload.id === 'string') &&
      ('name' in payload && typeof payload.name === 'string') &&
      ('email' in payload && typeof payload.email === 'string') &&
      ('avatarUrl' in payload && typeof payload.avatarUrl === 'string') &&
      ('isPro' in payload && typeof payload.isPro === 'boolean') &&
      ('favoriteOffers' in payload && typeof payload.favoriteOffers === 'object')
    );
  }

  async execute(req: Request, res: Response, next: NextFunction): Promise<void> {
    const { authorization } = req.headers;

    if(!authorization) {
      return next();
    }

    const [_, token] = authorization.split(' ');

    if(!token) {
      throw new UserUnauthorizedException();
    }

    try {
      const { payload } = await jwtVerify(token, makeSecretKey(token));

      if(!this.isTokenPayload(payload)) {
        throw new Error(ErrorText.INVALID_TOKEN);
      }

      req.tokenPayload = { ...payload };
      return next();

    } catch(err) {
      throw new HttpError(
        StatusCodes.UNAUTHORIZED,
        ErrorText.INVALID_TOKEN,
        this.getName()
      );
    }
  }
}
