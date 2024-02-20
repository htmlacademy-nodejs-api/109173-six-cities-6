import { NextFunction, Request, Response } from 'express';

export interface Middleware {
    getName(): string;
    execute(req: Request, res: Response, next: NextFunction): void;
}
