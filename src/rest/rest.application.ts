import { inject, injectable } from 'inversify';
import express from 'express';
import { Config } from '../shared/libs/config/config.interface.js';
import { RestSchema } from '../shared/libs/config/rest.schema.js';
import { Component } from '../shared/types/component.enum.js';
import { Logger } from '../shared/libs/logger/logger.interface.js';
import { Rest } from './rest.interface.js';
import { DatabaseClient } from '../shared/libs/database-client/database-client.interface.js';
import { getMongoURI } from '../utils/database.js';

const MessageText = {
  INIT: 'Rest application is initialized',
  INIT_SERVER: 'Server started on',
  INIT_DB: 'Initializing Database',
} as const;

@injectable()
export class RestApplication implements Rest{
  constructor(
    @inject(Component.Logger) private readonly logger: Logger,
    @inject(Component.Config) private readonly config: Config<RestSchema>,
    @inject(Component.DatabaseClient) private readonly database: DatabaseClient,
  ) {}

  private async initDb(): Promise<void> {
    this.logger.info(MessageText.INIT_DB);

    const dburi = getMongoURI(
      this.config.get('DB_USER'),
      this.config.get('DB_PASSWORD'),
      this.config.get('DB_HOST'),
      this.config.get('DB_PORT'),
      this.config.get('DB_NAME'),
    );

    return await this.database.connect(dburi);
  }

  private async initServer() {
    const app = express();
    const port = this.config.get('PORT');
    const serverHost = this.config.get('SERVER_HOST');

    app.get('/', (req, res) => res.send(`${MessageText.INIT_SERVER}: ${port}`));
    app.listen(port, () => this.logger.info(`${MessageText.INIT_SERVER}: ${serverHost}:${port}`));
  }

  public async init() {
    this.logger.info(`${MessageText.INIT}`);
    await this.initServer();

    this.logger.info(`${MessageText.INIT_DB}`);
    await this.initDb();
  }
}
