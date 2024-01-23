import { GlobalSettings } from '../../global-settings.js';
import { TSVFileReader } from '../../shared/libs/tsv-file-reader/tsv-file-reader.js';
import { Command, ExecuteParameters } from './command.interface.js';

const COMMAND_NAME = `${GlobalSettings.COMMAND_BEGINNING}import`;

const MessageText = {
  OFFERS: 'Offers in file: ',
} as const;

export class ImportCommand implements Command {
  getName(): string {
    return COMMAND_NAME;
  }

  async execute(...parameters: ExecuteParameters): Promise<void> {
    const [filepath] = parameters;
    const fileReader = new TSVFileReader(filepath);

    console.info(MessageText.OFFERS, fileReader.read());
  }
}
