import { GlobalSettings } from '../../global-settings.js';
import { TSVFileReader } from '../../shared/libs/tsv-file-reader/tsv-file-reader.js';
import { ReadEvent } from '../../shared/libs/tsv-settings.js';
import { adaptOfferToDB, makeOffer } from '../../utils/offer.js';
import { Command, ExecuteParameters } from './command.interface.js';
import { Logger } from '../../shared/libs/logger/logger.interface.js';
import { MongoDatabaseClient } from '../../shared/libs/database-client/mongo.database-client.js';
import { UserModel } from '../../shared/modules/user/user.entity.js';
import { OfferModel } from '../../shared/modules/offer/offer.entity.js';
import { RestConfig } from '../../shared/libs/config/rest.config.js';
import { getMongoURI } from '../../utils/database.js';
import { DefaultUserService, UserService } from '../../shared/modules/user/index.js';
import { OfferService } from '../../shared/modules/offer/offer-service.interface.js';
import { DefaultOfferService } from '../../shared/modules/offer/default-offer.service.js';
import { Offer } from '../../shared/types/offer.type.js';
import { ConsoleLogger } from '../../shared/libs/logger/console.logger.js';

const COMMAND_NAME = `${GlobalSettings.COMMAND_BEGINNING}import`;

const MessageText = {
  READ_ROWS: 'Read rows count:',
  PREPARED_OFFER: 'Prepared offer:'
} as const;

export class ImportCommand implements Command {
  private readonly userService: UserService;
  private readonly offerService: OfferService;
  private readonly logger: Logger;
  private readonly database: MongoDatabaseClient;
  private readonly config: RestConfig;

  constructor(){
    this.logger = new ConsoleLogger();
    this.userService = new DefaultUserService(UserModel, this.logger);
    this.offerService = new DefaultOfferService(OfferModel, this.logger);
    this.database = new MongoDatabaseClient(this.logger);
    this.config = new RestConfig(this.logger);
  }

  public getName(): string {
    return COMMAND_NAME;
  }

  private async onRowRead(readRow: string, resolve: () => void) {
    const offer = makeOffer(readRow);

    this.logger.info(`${MessageText.PREPARED_OFFER} `, offer);
    await this.saveToDatabase(offer);

    resolve();
  }

  private onFileReadEnd(readRowsCount: number) {
    this.logger.info(`${MessageText.READ_ROWS} ${readRowsCount}`);

    this.database.disconnect();
  }

  private async saveToDatabase(offer: Offer) {
    const salt = this.config.get('SALT');
    const user = await this.userService.findOrCreate(offer.user, salt);
    const offerToSave = adaptOfferToDB(offer, user);

    await this.offerService.create(offerToSave);
  }

  async execute(...parameters: ExecuteParameters): Promise<void> {
    const [
      filepath,
      username = this.config.get('DB_USER'),
      password = this.config.get('DB_PASSWORD'),
      host = this.config.get('DB_HOST'),
      port = this.config.get('DB_PORT'),
      dbname = this.config.get('DB_NAME')
    ] = parameters;
    const dburi = getMongoURI(username, password, host, port, dbname);

    this.database.connect(dburi);

    const fileReader = new TSVFileReader(filepath);
    await fileReader.read();

    fileReader.on(ReadEvent.READ_ROW, this.onRowRead.bind(this));
    fileReader.on(ReadEvent.END, this.onFileReadEnd.bind(this));
  }
}
