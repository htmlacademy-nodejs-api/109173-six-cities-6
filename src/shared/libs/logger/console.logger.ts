import { Logger } from './logger.interface.js';

export class ConsoleLogger implements Logger {
  private _messagePrefix = '--->';
  public info(message: string, ...args: unknown[]): void {
    console.info(`${this._messagePrefix} ${message}`, ...args);
  }

  public debug(message: string, ...args: unknown[]): void {
    console.debug(`${this._messagePrefix} ${message}`, ...args);
  }

  public warn(message: string, ...args: unknown[]): void {
    console.warn(`${this._messagePrefix} ${message}`, ...args);
  }

  public error(message: string, error: Error, ...args: unknown[]): void {
    console.error(`${this._messagePrefix} ${message}`, ...args);

    if(error instanceof Error) {
      console.error(error.message);
    }
  }
}
