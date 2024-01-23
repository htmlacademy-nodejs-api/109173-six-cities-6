import { getRandomBoolean, getRandomElement, getRandomElements, getRandomInRange } from '../../../utils/common.js';
import { FacilitiesType } from '../../types/facilities-type.js';
import { MockData } from '../../types/mock-data.type.js';
import { OfferType } from '../../types/offer-type.js';
import { User } from '../../types/user.type.js';
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


export class TSVFileGenerator {
  constructor(private readonly mockData: MockData) {}

  generate() {
    /**
     * FILE STRUCTURE:
     * name, description, date, city, previewImage,
       images, isPremium, isFavorite, rating, type,
       rooms, guests, price, facilities, author,
       comments, coordinates
     */
    const {offer, users} = this.mockData;
    const {names, descriptions, cities, previewImages, photos, type, facilities, comments} = offer;
    const name = getRandomElement<string>(names);
    const offerDescription = getRandomElement<string>(descriptions);
    const date = new Date().toISOString();
    const city = getRandomElement(cities);
    const preview = getRandomElements<string>(previewImages);
    const offerPhotos = getRandomElements<string>(photos);
    const premium = getRandomBoolean();
    const favorite = getRandomBoolean();
    const rating = getRandomInRange(Rating.MIN, Rating.MAX);
    const offerType = getRandomElement<OfferType>(type);
    const rooms = getRandomInRange(Room.MIN, Room.MAX);
    const guests = getRandomInRange(Guest.MIN, Guest.MAX);
    const offerPrice = getRandomInRange(Price.MIN, Price.MAX);
    const offerFacilities = getRandomElements<FacilitiesType>(facilities);
    const author = getRandomElement<User>(Object.values(users));
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
      author.name,
      comments ?? [],
      [latitude, longitude].join(TSVSettings.DELIMITER.VALUES)
    ].join(TSVSettings.DELIMITER.PARAMS);
  }
}
