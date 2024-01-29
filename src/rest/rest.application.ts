import { inject, injectable } from 'inversify';
import { Config } from '../shared/libs/config/config.interface.js';
import { RestSchema } from '../shared/libs/config/rest.schema.js';
import { Logger } from '../shared/libs/logger/logger.interface.js';
import { Rest } from './rest.interface.js';
import { Component } from '../shared/types/component.enum.js';

const MessageText = {
  INIT: 'Rest application is initialized on port',
  DB_HOST: 'Current database host IP',
  SALT: 'Current encoding Salt'
} as const;

@injectable()
export class RestApplication implements Rest{
  constructor(
    @inject(Component.Logger) private readonly logger: Logger,
    @inject(Component.Config) private readonly config: Config<RestSchema>
  ) {}

  init() {
    this.logger.info(`${MessageText.INIT}: ${this.config.get('PORT')}`);
    this.logger.info(`${MessageText.DB_HOST}: ${this.config.get('DB_HOST')}`);
    this.logger.info(`${MessageText.SALT}: ${this.config.get('SALT')}`);
  }
}
