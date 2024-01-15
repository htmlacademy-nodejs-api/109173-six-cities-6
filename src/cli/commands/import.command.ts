import { TSVFileReader } from '../../shared/libs/tsv-file-reader.js';
import { Command, ExecuteParameters } from './command.interface.js';

const Settings = {
  COMMAND_NAME: '--import',
  ENCODING: 'utf-8'
} as const;

export class ImportCommand implements Command {
  getName(): string {
    return Settings.COMMAND_NAME;
  }

  async execute(...parameters: ExecuteParameters): Promise<void> {
    const [filepath] = parameters;
    const fileReader = new TSVFileReader(filepath);

    console.info('Offers in file: ', fileReader.read());
  }
}
