import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { FileReader } from './tsv-file-reader.interface.js';
import { Offer } from '../../types/offer.type.js';
import { City } from '../../types/city.type.js';
import { OfferType } from '../../types/offer-type.js';
import { GlobalSettings } from '../../../global-settings.js';
import { TSVSettings } from '../tsv-settings.js';

const DEFAULT_FILEPATH = './src/mock/mock-data.tsv';
const {DELIMITER} = TSVSettings;

const ErrorText = {
  CANT_READ: 'Can`t read file'
} as const;

const MessageText = {
  IMPORTED: 'Imported file content: ',
} as const;

export class TSVFileReader implements FileReader {
  constructor(
    private readonly filePath: string = DEFAULT_FILEPATH
  ) {}

  public read() {
    try {
      const fileContent = readFileSync(resolve(this.filePath), GlobalSettings.CHARSET);
      const splittedContent = this.toArray(fileContent);

      console.info(MessageText.IMPORTED, splittedContent);
    } catch(err) {
      console.error(`${ErrorText.CANT_READ}: ${this.filePath}`);

      if(err instanceof Error) {
        console.error(err.message);
      }
    }

  }

  private toArray(fileContent: string): Offer[] {
    const offers = fileContent
      .trim()
      .split(DELIMITER.LINE)
      .filter((fileLine) => !fileLine.startsWith('#'))
      .map((fileLine) => {
        const [
          name,
          description,
          date,
          offerCity,
          previewImage,
          images,
          isPremium,
          isFavorite,
          rating,
          offerType,
          rooms,
          guests,
          price,
          facilities,
          author,
          comments,
          coordinates
        ] = fileLine.trim().split(DELIMITER.PARAMS);

        const [latitude, longitude] = coordinates.split(DELIMITER.VALUES);
        const city = offerCity as City;
        const type = offerType as OfferType;

        return {
          name,
          description,
          date: new Date(date).toISOString(),
          city,
          previewImage,
          images: images.split(DELIMITER.VALUES) ?? [],
          isPremium,
          isFavorite,
          rating,
          type,
          rooms,
          guests,
          price,
          facilities: facilities.split(DELIMITER.VALUES) ?? [],
          author,
          comments: comments.split(DELIMITER.VALUES) ?? [],
          coordinates: {latitude, longitude}
        };
      });

    return offers;
  }
}
