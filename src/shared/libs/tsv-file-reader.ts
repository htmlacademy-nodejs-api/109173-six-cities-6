import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';

const Delimiter = {
  LINE: '\n',
  PARAMS: '|',
  VALUES: ';'
};

const Settings = {
  DEFAULT_FILEPATH: './src/mocks/mocks-data.tsv',
  ENCODING: 'utf-8',
} as const;

const ErrorText = {
  CANT_READ: 'Can`t read file'
} as const;


export class TSVFileReader {
  constructor(
    private readonly filePath: string = Settings.DEFAULT_FILEPATH
  ) {}

  public read() {
    try {
      const fileContent = readFileSync(resolve(this.filePath), Settings.ENCODING);
      const splittedContent = this.toArray(fileContent);

      console.info('Imported file content: ', splittedContent);
    } catch(err) {
      console.error(`${ErrorText.CANT_READ}: ${this.filePath}`);

      if(err instanceof Error) {
        console.error(err.message);
      }
    }

  }

  private toArray(fileContent: string) {
    const offers = fileContent
      .trim()
      .split(Delimiter.LINE)
      .filter((fileLine) => !fileLine.startsWith('#'))
      .map((fileLine) => {
        const [
          name,
          description,
          date,
          city,
          previewImage,
          images,
          isPremium,
          isFavorite,
          rating,
          type,
          rooms,
          guests,
          price,
          facilities,
          author,
          comments,
          coordinates
        ] = fileLine.trim().split(Delimiter.PARAMS);

        console.log('---------------------- TEST: ', images);
        const [latitude, longitude] = coordinates.split(Delimiter.VALUES);

        return {
          name,
          description,
          date: new Date(date),
          city,
          previewImage,
          images: images.split(Delimiter.VALUES) ?? [],
          isPremium,
          isFavorite,
          rating,
          type,
          rooms,
          guests,
          price,
          facilities: facilities.split(Delimiter.VALUES) ?? [],
          author,
          comments,
          coordinates: {latitude, longitude}
        };
      });

    return offers;
  }
}
