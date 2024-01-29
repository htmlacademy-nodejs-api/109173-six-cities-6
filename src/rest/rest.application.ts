import { Logger } from '../shared/libs/logger/index.js';
import { Rest } from './rest.interface.js';

const TextMessage = {
  INIT: 'Rest application is initialized'
};

export class RestApplication implements Rest{
  init(logger: Logger) {
    logger.info(TextMessage.INIT);
  }
}
