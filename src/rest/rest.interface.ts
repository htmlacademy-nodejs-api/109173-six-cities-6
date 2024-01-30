import { Logger } from '../shared/libs/logger/index.js';

export interface Rest {
  init(logger: Logger): void
}
