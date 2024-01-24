import { ReadStream, createReadStream } from 'node:fs';
import { EventEmitter } from 'node:events';
import { resolve } from 'node:path';
import { FileReader } from './tsv-file-reader.interface.js';
import { GlobalSettings } from '../../../global-settings.js';
import { ReadEvent } from '../tsv-settings.js';

const CHUNK_SIZE = 16 * 1024; // 16 Kb

const ErrorText = {
  CANT_READ: 'Can`t read file'
} as const;

const MessageText = {
  INIT: 'Starting to read content',
} as const;

export class TSVFileReader extends EventEmitter implements FileReader {
  private stream: ReadStream;

  constructor(
    private readonly filePath: string
  ) {
    super();

    this.stream = createReadStream(resolve(this.filePath), {
      encoding: GlobalSettings.ENCODING,
      highWaterMark: CHUNK_SIZE
    });
  }

  public async read() {
    console.info(`${MessageText.INIT}: ${resolve(this.filePath)}`);

    let readData = '';
    let endRowPosition = 0;
    let readRowCount = 0;

    this.stream.on('readable', () => {
      const chunk = this.stream.read(CHUNK_SIZE);

      if(chunk !== null) {
        readData += chunk.toString();

        while((endRowPosition = readData.indexOf('\n')) >= 0) {
          const readRow = readData.slice(0, endRowPosition + 1);

          this.emit(ReadEvent.READ_ROW, readRow);

          readData = readData.slice(++endRowPosition);
          readRowCount++;
        }
      }
    });

    this.stream.on('error', () => {
      this.emit(ReadEvent.ERROR, readRowCount);

      console.error(`${ErrorText.CANT_READ}: ${resolve(this.filePath)}`);

      this.stream.destroy();
    });

    this.stream.on('end', () => this.emit(ReadEvent.END, readRowCount));
  }
}
