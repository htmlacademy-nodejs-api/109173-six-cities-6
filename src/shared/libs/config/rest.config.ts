import { inject, injectable } from 'inversify';
import { Component } from '../../types/component.enum.js';
import { config } from 'dotenv';
import { Config } from './config.interface.js';
import { Logger } from '../logger/logger.interface.js';
import { RestSchema, configRestSchema } from './rest.schema.js';

const MessageText = {
  SUCCESS: 'Application config (.env) successfully parsed',
} as const;

const ErrorText = {
  READ: 'Can`t read .env file (possible reason: file doesn`t exists).'
} as const;

@injectable()
export class RestConfig implements Config<RestSchema> {
  private readonly config: RestSchema;

  constructor(
    @inject(Component.Logger) private logger: Logger
  ) {
    const envContent = config();

    if(envContent.error) {
      logger.error(ErrorText.READ);
      throw new Error(ErrorText.READ);
    }

    configRestSchema.load({});
    configRestSchema.validate({ allowed: 'strict', output: logger.info });

    this.config = configRestSchema.getProperties();

    logger.info(MessageText.SUCCESS);
  }

  public get<T extends keyof RestSchema>(param: T): RestSchema[T] {
    return this.config[param];
  }
}
