import { resolve } from 'node:path';
import { Command } from './command.interface.js';
import { MockData } from '../../shared/types/mock-data.type.js';
import { ServiceURL, createAPI } from '../../shared/services/api.js';
import { TSVFileGenerator } from '../../shared/libs/tsv-file-generator/tsv-file-generator.js';
import { TSVFileWriter } from '../../shared/libs/tsv-file-writer/tsv-file-writer.js';
import { GlobalSettings } from '../../global-settings.js';
import { injectable } from 'inversify';

const COMMAND_NAME = `${GlobalSettings.COMMAND_BEGINNING}generate`;

const ErrorText = {
  LOAD: 'Can`t load data from url:',
} as const;
@injectable()
export class GenerateCommand implements Command {
  private data: MockData | null = null;

  private async load(url: string = ServiceURL.API) {
    try {
      const api = createAPI();
      const {data} = await api.get(url);

      this.data = data;
    } catch(err) {
      throw new Error(ErrorText.LOAD);
    }
  }

  private async write(dataCount: number, filePath: string) {
    if(this.data === null) {
      return;
    }

    const TSVGenerator = new TSVFileGenerator(this.data);
    const TSVWriter = new TSVFileWriter(resolve(filePath));

    for(let i = 0; i <= dataCount; i++) {
      const mockData = TSVGenerator.generate();

      await TSVWriter.write(mockData);
    }
  }

  getName(): string {
    return COMMAND_NAME;
  }

  async execute(...parameters: string[]) {
    const [dataCount, filePath, url] = parameters;
    const safeDataCount = Number.parseInt(dataCount, 10);

    await this.load(url);

    this.write(safeDataCount, filePath);
  }
}
