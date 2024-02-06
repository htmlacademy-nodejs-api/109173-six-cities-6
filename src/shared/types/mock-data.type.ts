import { City } from './city-type.enum.js';

type MockCities = {
  name: City,
  latitude: string,
  longitude: string,
};
type MockOffer = {
  names: string[],
  descriptions: string[],
  cities: MockCities[],
  comments: [],
  previewImages: string[],
  photos: string[],
  type: string[],
  facilities: string[],
}
type MockUsers = {
  names: string[],
  emails: string[],
  avatarUrls: string[],
  passwords: string[]
}

export type MockData = {
  offer: MockOffer,
  users: MockUsers,
};
