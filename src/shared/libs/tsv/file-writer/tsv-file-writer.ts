import { WriteStream, createWriteStream } from 'node:fs';

export class TSVFileWriter {
  private stream: WriteStream;

  constructor(private readonly filename: string) {
    this.stream = createWriteStream(filename, {
      flags: 'w',
      encoding: 'utf-8',
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
