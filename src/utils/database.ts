import { RestConfig } from '../shared/libs/config/rest.config.js';
import { PinoLogger } from '../shared/libs/logger/pino.logger.js';

export function getMongoURI(
  username: string,
  password: string,
  host: string,
  port: string,
  dbname: string): string {
  return `mongodb://${username}:${password}@${host}:${port}/${dbname}?authSource=admin`;
}

export function getDbConnectiondata() {
  const logger = new PinoLogger();
  const config = new RestConfig(logger);

  const username = config.get('DB_USER');
  const password = config.get('DB_PASSWORD');
  const host = config.get('DB_HOST');
  const port = config.get('DB_PORT');
  const dbname = config.get('DB_NAME');

  return {username, password, host, port, dbname};
}
