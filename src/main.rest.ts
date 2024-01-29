import { RestApplication } from './rest/rest.application.js';
import { PinoLogger } from './shared/libs/logger/pino.logger.js';

async function bootstrap() {
  const logger = new PinoLogger();
  const restApplication = new RestApplication();

  await restApplication.init(logger);
}

bootstrap();
