import { inject, injectable } from 'inversify';
import { STATIC_RESOURCE_FIELDS } from './path-transformer.constant.js';
import { Component } from '../../../types/component.enum.js';
import { RestConfig } from '../../config/rest.config.js';
import { getDirectoryFiles } from '../../../../utils/file-system.js';
import { Logger } from 'pino';
import { StaticRoutes } from '../../../../rest/rest.constant.js';
import { getFullServerPath, isObject, isValidURL } from '../../../../utils/common.js';

@injectable()
export class PathTransformer {
  public readonly defaultStaticImages: string[] = [];

  constructor(
    @inject(Component.Logger) private readonly logger: Logger,
    @inject(Component.Config) private readonly config: RestConfig,
  ){
    this.defaultStaticImages = getDirectoryFiles(this.config.get('STATIC_FILES_DIRECTORY'));
  }

  private isStaticProperty(property: string): boolean {
    return STATIC_RESOURCE_FIELDS.includes(property);
  }

  private isDefaultImage(value: string): boolean {
    return this.defaultStaticImages.includes(value);
  }

  private getRootPath(fileName: string) {
    if(isValidURL(fileName)) {
      return fileName;
    }

    const serverProtocol = this.config.get('PROTO');
    const serverHost = this.config.get('HOST');
    const serverPort = this.config.get('PORT');

    const staticPath = StaticRoutes.APP_FILES;
    const uploadPath = StaticRoutes.UPLOAD_FILES;

    const rootPath = this.isDefaultImage(fileName) ? staticPath : uploadPath;

    return `${getFullServerPath(serverProtocol, serverHost, serverPort)}${rootPath}/${fileName}`;
  }

  public execute(data: Record<string, unknown>): Record<string, unknown> {
    const stack = [data];
    while (stack.length > 0) {
      const current = stack.pop();

      for (const key in current) {
        if (Object.hasOwn(current, key)) {
          const value = current[key];

          if (isObject(value) && !Array.isArray(value)) {
            stack.push(value as Record<string, unknown>);
            continue;
          }

          if(!this.isStaticProperty(key)) {
            continue;
          }

          // // Обрабатываем обычные строковые параметры
          if (typeof value === 'string') {
            current[key] = this.getRootPath(value);
          }

          // Обрабатываем массивы изображений
          if (Array.isArray(value)) {
            current[key] = value.map((item) => this.getRootPath(item));
          }
        }
      }
    }
    return data;
  }
}
