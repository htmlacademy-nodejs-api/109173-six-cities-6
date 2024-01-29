import convict from 'convict';
import validator from 'convict-format-with-validator';

convict.addFormats(validator);

export type RestSchema = {
  PORT: number,
  DB_HOST: string,
  SALT: string,
}

export const configRestSchema = convict<RestSchema>({
  PORT: {
    doc: 'Application port for incoming connection',
    format: 'port',
    default: 4000,
    env: 'PORT',
  },
  DB_HOST: {
    doc: 'Database`s host IP-adress (MongoDB)',
    format: 'ipaddress',
    default: null,
    env: 'DB_HOST',
  },
  SALT: {
    doc: 'Special string to encoding user password',
    format: String,
    default: null,
    env: 'SALT',
  }
});
