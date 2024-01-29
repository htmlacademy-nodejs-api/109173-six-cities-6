import convict from 'convict';

export type RestSchema = {
  PORT: number
}

export const configRestSchema = convict<RestSchema>({
  PORT: {
    doc: 'Application port for incoming connection',
    format: 'port',
    default: 4000,
    env: 'PORT',
  }
});
