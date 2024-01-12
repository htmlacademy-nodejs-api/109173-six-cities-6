import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
// import { Offer } from '../types/offer.type.js';

const Settings = {
  COMMAND_NAME: '--import',
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
      console.log(splittedContent);
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
      .split('\n')
      .slice()
      .map((fileLine) => {
        if(fileLine.startsWith('#')) {
          return;
        }

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
        ] = fileLine.trim().split('|');

        const [lat, long] = coordinates.split(';');

        return {
          name,
          description,
          date: new Date(date),
          city,
          previewImage,
          images: images.split(';') ?? [],
          isPremium,
          isFavorite,
          rating,
          type,
          rooms,
          guests,
          price,
          facilities: facilities.split(';') ?? [],
          author,
          comments,
          coordinates: {lat, long}
        };
      });

    return offers;
  }
}
