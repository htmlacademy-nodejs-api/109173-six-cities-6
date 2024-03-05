import { injectable } from 'inversify';
import { resolve } from 'node:path';
import { Logger as PinoInstance, pino, transport } from 'pino';
import { Logger } from './logger.interface.js';
import { getCurrentModuleDirectoryPath } from '../../../utils/file-system.js';
import { REST_LOGS } from '../../../rest/rest.constant.js';

const MessageText = {
  INIT: 'Logger initialized'
};

@injectable()
export class PinoLogger implements Logger {
  private readonly logger: PinoInstance;

  constructor(
    private readonly logToFile: boolean = true,
    private readonly logFilePath?: string
  ) {
    const transports = [
      {
        target: 'pino/file',
        options: {}, // Write logs into console
        level: 'info'
      }
    ];

    if(this.logToFile) {
      const modulePath = getCurrentModuleDirectoryPath();
      this.logFilePath ??= resolve(modulePath, '../../', REST_LOGS);

      transports.push(
        {
          target: 'pino/file',
          options: { destination: this.logFilePath }, // Write logs into file
          level: 'debug'
        },
      );
    }

    this.logger = pino({}, transport({ targets: transports }));

    this.logger.info(MessageText.INIT);
  }

  info(message: string, ...args: unknown[]) {
    this.logger.info(message, ...args);
  }

  warn(message: string, ...args: unknown[]) {
    this.logger.warn(message, ...args);
  }

  debug(message: string, ...args: unknown[]) {
    this.logger.debug(message, ...args);
  }

  error(message: string, ...args: unknown[]) {
    this.logger.error(message, ...args);
  }
}
