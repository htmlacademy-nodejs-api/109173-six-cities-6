import { inject, injectable } from 'inversify';
import { STATIC_RESOURCE_FIELDS } from './path-transformer.constant.js';
import { Component } from '../../../types/component.enum.js';
import { RestConfig } from '../../config/rest.config.js';
import { getDirectoryFiles } from '../../../../utils/file-system.js';
import { Logger } from 'pino';
import { isObject } from 'class-validator';
import { StaticRoutes } from '../../../../rest/rest.constant.js';
import { getFullServerPath } from '../../../../utils/common.js';

@injectable()
export class PathTransformer {
  public readonly defaultStaticImages: string[] = [];

  constructor(
    @inject(Component.Logger) private readonly logger: Logger,
    @inject(Component.Config) private readonly config: RestConfig,
  ){
    this.defaultStaticImages = getDirectoryFiles(this.config.get('STATIC_FILES_DIRECTORY').slice(1));
  }

  private isStaticProperty(property: string): boolean {
    return STATIC_RESOURCE_FIELDS.includes(property);
  }

  private isDefaultImage(value: string): boolean {
    return this.defaultStaticImages.includes(value);
  }

  private getRootPath(filaName: string) {
    const serverProtocol = this.config.get('PROTO');
    const serverHost = this.config.get('HOST');
    const serverPort = this.config.get('PORT');

    const staticPath = StaticRoutes.APP_FILES;
    const uploadPath = StaticRoutes.UPLOAD_FILES;

    const rootPath = this.isDefaultImage(filaName) ? staticPath : uploadPath;

    return `${getFullServerPath(serverProtocol, serverHost, serverPort)}${rootPath}/${filaName}`;
  }

  public execute(data: Record<string, unknown>): Record<string, unknown> {
    const stack = [data];
    while (stack.length > 0) {
      const current = stack.pop();

      for (const key in current) {
        if (Object.hasOwn(current, key)) {
          const value = current[key];

          if (isObject(value)) {
            stack.push(value as Record<string, unknown>);
            continue;
          }

          if (this.isStaticProperty(key) && typeof value === 'string') {

            current[key] = this.getRootPath(value);
          }
        }
      }
    }

    return data;
  }
}
