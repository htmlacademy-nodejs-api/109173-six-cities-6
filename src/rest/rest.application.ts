import { inject, injectable } from 'inversify';
import express, { Express } from 'express';
import { Config } from '../shared/libs/config/config.interface.js';
import { RestSchema } from '../shared/libs/config/rest.schema.js';
import { Component } from '../shared/types/component.enum.js';
import { Logger } from '../shared/libs/logger/logger.interface.js';
import { Rest } from './rest.interface.js';
import { DatabaseClient } from '../shared/libs/database-client/database-client.interface.js';
import { getMongoURI } from '../utils/database.js';
import { UserController } from '../shared/modules/user/user.controller.js';

const MessageText = {
  INIT: 'Rest application is initialized',
  INIT_SERVER: 'Server started on',
  INIT_CONTROLLERS: 'Controller initialized',
  INIT_MIDDLEWARE: 'Initializing middlewares',
  INIT_DB: 'Initializing Database',
} as const;

@injectable()
export class RestApplication implements Rest{
  private readonly server: Express;

  constructor(
    @inject(Component.Logger) private readonly logger: Logger,
    @inject(Component.Config) private readonly config: Config<RestSchema>,
    @inject(Component.DatabaseClient) private readonly database: DatabaseClient,
    @inject(Component.UserController) private readonly userController: UserController,
  ) {
    this.server = express();
  }

  private async initDb(): Promise<void> {
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
    const port = this.config.get('PORT');
    const serverHost = this.config.get('SERVER_HOST');

    this.server.listen(port, () => this.logger.info(`${MessageText.INIT_SERVER}: ${serverHost}:${port}`));
  }

  private async initControllers() {
    this.server.use('/users', this.userController.router);
  }

  private async initMiddleware() {
    this.server.use(express.json());
  }

  public async init() {
    this.logger.info(`${MessageText.INIT}`);
    await this.initServer();

    this.logger.info(`${MessageText.INIT_CONTROLLERS}: UserController`);
    await this.initControllers();

    this.logger.info(`${MessageText.INIT_MIDDLEWARE}`);
    await this.initMiddleware();

    this.logger.info(`${MessageText.INIT_DB}`);
    await this.initDb();
  }
}
