import { GlobalSettings } from '../../global-settings.js';
import { TSVFileReader } from '../../shared/libs/tsv-file-reader/tsv-file-reader.js';
import { ReadEvent } from '../../shared/libs/tsv-settings.js';
import { makeOffer } from '../../utils/offer.js';
import { Command, ExecuteParameters } from './command.interface.js';

const COMMAND_NAME = `${GlobalSettings.COMMAND_BEGINNING}import`;

const MessageText = {
  READ_ROWS: 'Read rows count',
  PREPARED_OFFER: 'Prepared offer'
} as const;

export class ImportCommand implements Command {
  getName(): string {
    return COMMAND_NAME;
  }

  private onRowRead(readRow: string) {
    console.info(`${MessageText.PREPARED_OFFER}:\n`, makeOffer(readRow));
  }

  private onFileReadEnd(readRowsCount: number) {
    console.info(`${MessageText.READ_ROWS}: ${readRowsCount}`);
  }

  async execute(...parameters: ExecuteParameters): Promise<void> {
    const [filepath] = parameters;
    const fileReader = new TSVFileReader(filepath);
    await fileReader.read();

    fileReader.on(ReadEvent.READ_ROW, this.onRowRead);
    fileReader.on(ReadEvent.END, this.onFileReadEnd);
  }
}
