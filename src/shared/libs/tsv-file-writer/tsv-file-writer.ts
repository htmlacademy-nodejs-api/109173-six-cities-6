import { WriteStream, createWriteStream } from 'node:fs';
import { FileWriter } from './tsv-file-writer.interface.js';
import { ENCODING } from '../../../cli/cli.constant.js';

export class TSVFileWriter implements FileWriter {
  private stream: WriteStream;

  constructor(private readonly filename: string) {
    this.stream = createWriteStream(filename, {
      flags: 'w',
      encoding: ENCODING,
      autoClose: true,
    });
  }

  write(data: string) {
    const preparedData = `${data}\n`;
    const dataWriteStatus = this.stream.write(preparedData);

    this.checkWriteStatus(dataWriteStatus);
  }

  checkWriteStatus(writeStatus: boolean): Promise<unknown> {
    if(!writeStatus) {
      new Promise((resolve) => {
        this.stream.once('drain', () => resolve(true));
      });
    }

    return Promise.resolve();
  }
}
