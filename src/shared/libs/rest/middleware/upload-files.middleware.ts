import { Request, Response, NextFunction } from 'express';
import { Middleware } from './middleware.interface.js';
import multer, { diskStorage } from 'multer';
import { randomUUID } from 'node:crypto';
import { extension } from 'mime-types';

export class UploadFilesMiddleware implements Middleware {
  constructor(
    private readonly uploadFileDirectory: string,
    private readonly fieldName: string
  ){}

  public getName(): string {
    return 'UploadFilesMiddleware';
  }

  public async execute(req: Request, res: Response, next: NextFunction): Promise<void> {
    const storage = diskStorage({
      destination: this.uploadFileDirectory,
      filename: (_req, file, callback) => {
        const fileExt = extension(file.mimetype);
        const suffix = randomUUID();
        const filename = `${file.fieldname}.${suffix}.${fileExt}`;

        callback(null, filename);
      }
    });

    const uploadSingleFileMiddleware = multer({ storage }).single(this.fieldName);

    uploadSingleFileMiddleware(req, res, next);
  }
}
