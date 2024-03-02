import convict from 'convict';
import validator from 'convict-format-with-validator';

convict.addFormats(validator);

export type RestSchema = {
  PORT: number,
  DB_HOST: string,
  DB_PORT: string,
  DB_NAME: string,
  DB_NAME_EXPRESS: string,
  DB_USER: string,
  DB_PASSWORD: string,
  SERVER_HOST: string,
  SALT: string,
  UPLOAD_FILES_DIRECTORY: string,
  JWT_SECRET: string,
  JWT_SECRET_REFRESH: string,
  JWT_EXPIRED: string,
  JWT_ALGORITHM: string,
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
  DB_PORT: {
    doc: 'Database`s port',
    format: 'port',
    default: '27017',
    env: 'DB_PORT',
  },
  DB_USER: {
    doc: 'Database`s user name (MongoDB)',
    format: String,
    default: null,
    env: 'DB_USER',
  },
  DB_PASSWORD: {
    doc: 'Database`s user password (MongoDB)',
    format: String,
    default: null,
    env: 'DB_PASSWORD',
  },
  DB_NAME: {
    doc: 'Database`s name (MongoDB)',
    format: String,
    default: null,
    env: 'DB_NAME',
  },
  DB_NAME_EXPRESS: {
    doc: 'Database`s UI name (MongoDB Express)',
    format: String,
    default: 'six-cities_mongo_express',
    env: 'DB_NAME_EXPRESS',
  },
  SERVER_HOST: {
    doc: 'REST Servers host',
    format: String,
    default: 'http://localhost',
    env: 'SERVER_HOST',
  },
  SALT: {
    doc: 'Special string to encoding user password',
    format: String,
    default: null,
    env: 'SALT',
  },
  UPLOAD_FILES_DIRECTORY: {
    doc: 'Directory for users files',
    format: String,
    default: null,
    env: 'UPLOAD_FILES_DIRECTORY',
  },
  JWT_SECRET: {
    doc: 'Secret string to create JWT-Token',
    format: String,
    default: null,
    env: 'JWT_SECRET',
  },
  JWT_SECRET_REFRESH: {
    doc: 'Secret string to create JWT-Refresh-Token',
    format: String,
    default: null,
    env: 'JWT_SECRET_REFRESH',
  },
  JWT_EXPIRED: {
    doc: 'Token expiration time',
    format: String,
    default: null,
    env: 'JWT_EXPIRED',
  },
  JWT_ALGORITHM: {
    doc: 'JWT Algorithm to make encrypt token string',
    format: String,
    default: null,
    env: 'JWT_ALGORITHM',
  }
});
