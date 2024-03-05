import { Request, Response, NextFunction } from 'express';
import { Middleware } from './middleware.interface.js';
import { DocumentExists } from '../../../types/document-exists.interface.js';
import { HttpError } from '../errors/http-error.js';
import { StatusCodes } from 'http-status-codes';
import { ServiceEntityName } from '../../../types/service-entity-name.interface.js';

const ErrorText = {
  NOT_FOUND_DOC_ID: 'Document with ID',
  NOT_FOUND_ENTITY: 'not found in entity'
};

export class DocumentExistsMiddleware implements Middleware {
  constructor(
    private readonly paramName: string,
    private readonly service: DocumentExists & ServiceEntityName

  ){}

  public getName(): string {
    return 'DocumentExistsMiddleware';
  }

  public async execute({ params }: Request, _res: Response, next: NextFunction): Promise<void> {
    const documentId = params[this.paramName];
    const entityName = this.service.getEntityName();

    if(! await this.service.exists(documentId)) {
      throw new HttpError(
        StatusCodes.NOT_FOUND,
        `${ErrorText.NOT_FOUND_DOC_ID}: ${documentId} ${ErrorText.NOT_FOUND_ENTITY}: ${entityName}`,
        this.getName()
      );
    }

    return next();
  }
}
