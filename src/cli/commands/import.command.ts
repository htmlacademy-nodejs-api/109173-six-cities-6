import { inject, injectable } from 'inversify';
import { GlobalSettings } from '../../global-settings.js';
import { TSVFileReader } from '../../shared/libs/tsv-file-reader/tsv-file-reader.js';
import { ReadEvent } from '../../shared/libs/tsv-settings.js';
import { makeOffer } from '../../utils/offer.js';
import { Command, ExecuteParameters } from './command.interface.js';
import { Component } from '../../shared/types/component.enum.js';
import { Logger } from '../../shared/libs/logger/logger.interface.js';
import { MongoDatabaseClient } from '../../shared/libs/database-client/mongo.database-client.js';
import { UserEntity } from '../../shared/modules/user/user.entity.js';
import { OfferEntity } from '../../shared/modules/offer/offer.entity.js';
import { RestConfig } from '../../shared/libs/config/rest.config.js';
import { getMongoURI } from '../../utils/database.js';

const COMMAND_NAME = `${GlobalSettings.COMMAND_BEGINNING}import`;

const MessageText = {
  READ_ROWS: 'Read rows count',
  PREPARED_OFFER: 'Prepared offer'
} as const;

@injectable()
export class ImportCommand implements Command {
  constructor(
    @inject(Component.UserService) private readonly userService: UserEntity,
    @inject(Component.OfferService) private readonly offerService: OfferEntity,
    @inject(Component.Logger) private readonly logger: Logger,
    @inject(Component.DatabaseClient) private readonly database: MongoDatabaseClient,
    @inject(Component.Config) private readonly config: RestConfig,
  ){}

  public getName(): string {
    return COMMAND_NAME;
  }

  private onRowRead(readRow: string) {
    this.logger.info(`${MessageText.PREPARED_OFFER}:\n`, makeOffer(readRow));
  }

  private onFileReadEnd(readRowsCount: number) {
    this.logger.info(`${MessageText.READ_ROWS}: ${readRowsCount}`);

    this.database.disconnect();
  }

  async execute(...parameters: ExecuteParameters): Promise<void> {
    const [
      filepath,
      username,
      password,
      host,
      port = this.config.get('DB_PORT'),
      dbname = this.config.get('DB_NAME')
    ] = parameters;
    const dburi = getMongoURI(username, password, host, port, dbname);

    this.database.connect(dburi);

    const fileReader = new TSVFileReader(filepath);
    await fileReader.read();

    fileReader.on(ReadEvent.READ_ROW, this.onRowRead);
    fileReader.on(ReadEvent.END, this.onFileReadEnd);
  }
}
