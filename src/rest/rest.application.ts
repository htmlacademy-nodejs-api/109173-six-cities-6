import { RestConfig } from '../shared/libs/config/rest.config.js';
import { Logger } from '../shared/libs/logger/index.js';
import { Rest } from './rest.interface.js';

const MessageText = {
  INIT: 'Rest application is initialized on port'
} as const;

export class RestApplication implements Rest{
  init(logger: Logger) {
    const config = new RestConfig(logger);
    logger.info(`${MessageText.INIT} ${config.get('PORT')}`);
  }
}
