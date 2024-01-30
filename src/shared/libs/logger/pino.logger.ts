import { injectable } from 'inversify';
import { resolve } from 'node:path';
import { Logger as PinoInstance, pino, transport } from 'pino';
import { Logger } from './logger.interface.js';
import { GlobalSettings } from '../../../global-settings.js';
import { getCurrentModuleDirectoryPath } from '../../../utils/file-system.js';

const MessageText = {
  INIT: 'Logger initialized'
};

@injectable()
export class PinoLogger implements Logger {
  private readonly logger: PinoInstance;

  constructor() {
    const modulePath = getCurrentModuleDirectoryPath();
    const logFilePath = resolve(modulePath, '../../', GlobalSettings.REST_LOGS);
    const transports = [
      {
        target: 'pino/file',
        options: { destination: logFilePath }, // Write logs into file
        level: 'debug'
      },
      {
        target: 'pino/file',
        oprions: {}, // Write logs into console
        level: 'info'
      }
    ];

    this.logger = pino({}, transport({ targets: transports }));

    this.logger.info(MessageText.INIT);
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
