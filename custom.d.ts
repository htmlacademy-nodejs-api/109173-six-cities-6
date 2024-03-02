import { TokenPayload } from './src/shared/types/token-payload.type.js';

declare module 'express-serve-static-core' {
  export interface Request {
    tokenPayload: TokenPayload
  }
}
