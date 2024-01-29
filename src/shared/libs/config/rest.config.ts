import { DotenvParseOutput, config } from 'dotenv';
import { Logger } from '../logger/index.js';
import { Config } from './config.interface.js';

const MessageText = {
  SUCCESS: 'Application config (.env) successfully read.'
};

const ErrorText = {
  READ: 'Can`t read .env file (possible reason: file doesn`t exists).'
} as const;

export class RestConfig implements Config {
  private readonly config: NodeJS.ProcessEnv;
  constructor(
    private logger: Logger
  ) {
    const envContent = config();

    if(envContent.error) {
      logger.error(ErrorText.READ);
      throw new Error(ErrorText.READ);
    }

    this.config = <DotenvParseOutput>envContent.parsed;
    logger.info(MessageText.SUCCESS);
  }

  get(param: string) {
    return this.config[param];
  }
}
