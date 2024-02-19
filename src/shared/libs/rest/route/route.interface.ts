import { NextFunction, Request, Response } from 'express';
import { HttpMethodType } from '../types/http-method.enum.js';

export interface Route {
  path: string
  method: HttpMethodType
  handler: (req: Request, res: Response, next: NextFunction) => void
}

