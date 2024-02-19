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
import { AppExceptionFilter } from '../shared/libs/rest/exception-filter/app-exception-filter.js';
import { OfferController } from '../shared/modules/offer/offer.controller.js';

const MessageText = {
  INIT: 'Rest application is initialized',
  INIT_DB: 'Initializing: Database ...',
  INIT_MIDDLEWARE: 'Initializing: Middlewares ...',
  INIT_CONTROLLERS: 'Initializing: Controllers ...',
  INIT_EXCEPTION_FILTERS: 'Initializing: Exception Filters ...',
  INIT_SERVER: 'Initializing: Server ...',
  INIT_SERVER_SUCCESS: 'Server started on',
} as const;

@injectable()
export class RestApplication implements Rest{
  private readonly server: Express;

  constructor(
    @inject(Component.Logger) private readonly logger: Logger,
    @inject(Component.Config) private readonly config: Config<RestSchema>,
    @inject(Component.DatabaseClient) private readonly database: DatabaseClient,
    @inject(Component.UserController) private readonly userController: UserController,
    @inject(Component.OfferController) private readonly offerController: OfferController,
    @inject(Component.AppExceptionFilter) private readonly appExceptionFilter: AppExceptionFilter,
  ) {
    this.server = express();
  }

  private async initDb(): Promise<void> {
    const dbUri = getMongoURI(
      this.config.get('DB_USER'),
      this.config.get('DB_PASSWORD'),
      this.config.get('DB_HOST'),
      this.config.get('DB_PORT'),
      this.config.get('DB_NAME'),
    );

    return await this.database.connect(dbUri);
  }

  private async initMiddleware() {
    this.server.use(express.json());
  }

  private async initControllers() {
    this.server.use('/users', this.userController.router);
    this.server.use('/offers', this.offerController.router);
  }

  private async initExceptionFilters() {
    this.server.use(this.appExceptionFilter.catch.bind(this.appExceptionFilter));
  }

  private async initServer() {
    const port = this.config.get('PORT');
    const serverHost = this.config.get('SERVER_HOST');

    this.server.listen(port, () => this.logger.info(`${MessageText.INIT_SERVER_SUCCESS}: ${serverHost}:${port}`));
  }

  public async init() {
    this.logger.info(MessageText.INIT_DB);
    await this.initDb();

    this.logger.info(MessageText.INIT_MIDDLEWARE);
    await this.initMiddleware();

    this.logger.info(MessageText.INIT_CONTROLLERS);
    await this.initControllers();

    this.logger.info(MessageText.INIT_EXCEPTION_FILTERS);
    await this.initExceptionFilters();

    this.logger.info(MessageText.INIT_SERVER);
    await this.initServer();
    this.logger.info(MessageText.INIT);
  }
}
