import { getRandomBoolean, getRandomElement, getRandomElements, getRandomInRange } from '../../../utils/common.js';
import { MockData } from '../../types/mock-data.type.js';
import { TSVSettings } from '../tsv-settings.js';

const Rating = {
  MIN: 1,
  MAX: 5,
};

const Room = {
  MIN: 1,
  MAX: 8,
};

const Guest = {
  MIN: 1,
  MAX: 10,
};

const Price = {
  MIN: 100,
  MAX: 100000,
};

const Image = {
  MIN: 6,
  MAX: 10
};

export class TSVFileGenerator {
  constructor(private readonly mockData: MockData) {}

  generate(): string {
    /**
     * FILE STRUCTURE:
     * name, description, date, city, previewImage,
       images, isPremium, isFavorite, rating, type,
       rooms, guests, price, facilities, author
       comments, coordinates
     */
    const {offer, users} = this.mockData;
    const {names, descriptions, cities, previewImages, photos, type, facilities, comments} = offer;
    const name = getRandomElement<string>(names);
    const offerDescription = getRandomElement<string>(descriptions);
    const date = new Date().toISOString();
    const city = getRandomElement(cities);
    const preview = getRandomElements<string>(previewImages);
    const offerPhotos = getRandomElements<string>(photos, getRandomInRange(Image.MIN, Image.MAX));
    const premium = getRandomBoolean();
    const favorite = getRandomBoolean();
    const rating = getRandomInRange(Rating.MIN, Rating.MAX);
    const offerType = getRandomElement(type);
    const rooms = getRandomInRange(Room.MIN, Room.MAX);
    const guests = getRandomInRange(Guest.MIN, Guest.MAX);
    const offerPrice = getRandomInRange(Price.MIN, Price.MAX);
    const offerFacilities = getRandomElements(facilities);

    const userName = getRandomElement(users.names);
    const userEmail = getRandomElement(users.emails);
    const userAvatar = getRandomElement(users.avatarUrls);
    const userPassword = getRandomElement(users.passwords);
    const userIsPro = getRandomBoolean();
    const author = [userName, userEmail, userAvatar, userPassword, userIsPro].join(TSVSettings.DELIMITER.VALUES);

    const {latitude, longitude} = city;

    return [
      name,
      offerDescription,
      date,
      city.name,
      preview.join(TSVSettings.DELIMITER.VALUES),
      offerPhotos.join(TSVSettings.DELIMITER.VALUES),
      premium,
      favorite,
      rating,
      offerType,
      rooms,
      guests,
      offerPrice,
      offerFacilities.join(TSVSettings.DELIMITER.VALUES),
      author,
      comments ?? [],
      [latitude, longitude].join(TSVSettings.DELIMITER.VALUES)
    ].join(TSVSettings.DELIMITER.PARAMS);
  }
}
