import { Logger as PinoInstance, pino } from 'pino';
import { Logger } from './logger.interface.js';

export class PinoLogger implements Logger {
  private readonly logger: PinoInstance;

  constructor() {
    this.logger = pino();
  }

  info(message: string, ...args: unknown[]) {
    this.logger.info(message, args);
  }

  warn(message: string, ...args: unknown[]) {
    this.logger.warn(message, args);
  }

  debug(message: string, ...args: unknown[]) {
    this.logger.debug(message, args);
  }

  error(message: string, ...args: unknown[]) {
    this.logger.error(message, args);
  }
}
