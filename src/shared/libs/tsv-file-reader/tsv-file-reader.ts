import { ReadStream, createReadStream } from 'node:fs';
import { resolve } from 'node:path';
import { FileReader } from './tsv-file-reader.interface.js';
import { TSVSettings } from '../tsv-settings.js';
import { GlobalSettings } from '../../../global-settings.js';

const CHUNK_SIZE = 16 * 1024; // 16 Kb

const ErrorText = {
  CANT_READ: 'Can`t read file'
} as const;

const MessageText = {
  INIT: 'Starting to read content:',
  ROWS_COUNT: 'Read rows count:'
} as const;

export class TSVFileReader implements FileReader {
  private stream: ReadStream;

  constructor(
    private readonly filePath: string
  ) {
    this.stream = createReadStream(resolve(this.filePath), {
      encoding: GlobalSettings.ENCODING,
      highWaterMark: CHUNK_SIZE
    });
  }

  public async read() {
    console.info(`${MessageText.INIT} ${resolve(this.filePath)}`);

    let readData = '';
    let endRowPosition = 0;
    let readRowCount = 0;

    this.stream.on('readable', () => {
      const chunk = this.stream.read(CHUNK_SIZE);

      if(chunk !== null) {
        readData += chunk.toString();

        while((endRowPosition = readData.indexOf('\n')) >= 0) {
          const readLine = readData.slice(0, endRowPosition + 1);

          console.log('Read line: ', readLine);

          readData = readData.slice(++endRowPosition);
          readRowCount++;
        }
      }

      console.info(`${MessageText.ROWS_COUNT} ${readRowCount}`);
    });
  }
}
