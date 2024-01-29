import { Config } from '../shared/libs/config/config.interface.js';
import { Logger } from '../shared/libs/logger/logger.interface.js';
import { Rest } from './rest.interface.js';

const MessageText = {
  INIT: 'Rest application is initialized on port'
} as const;

export class RestApplication implements Rest{
  constructor(
    private readonly logger: Logger,
    private readonly config: Config
  ) {}

  init() {
    this.logger.info(`${MessageText.INIT} ${this.config.get('PORT')}`);
  }
}
