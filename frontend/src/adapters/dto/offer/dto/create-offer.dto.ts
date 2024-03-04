export class CreateOfferDTO {
  public name!: string;
  public description!: string;
  public date!: string;
  public city!: City;
  public previewImage!: string;
  public images!: Images;
  public isPremium!: boolean;
  public isFavorite!: boolean;
  public rating!: number;
  public type!: OfferType;
  public rooms!: number;
  public guests!: number;
  public price!: number;
  public facilities!: FacilitiesType[];
  public userId!: string;
  public commentCount!: number;
  public coordinates!: Coordinate;
}

export const OfferTypes = {
  Apartment: 'apartment',
  House: 'house',
  Room: 'room',
  Hotel: 'hotel',
} as const;

type OfferTypeKeys = keyof typeof OfferTypes
export type OfferType = (typeof OfferTypes)[OfferTypeKeys];
export const offersTypeList: OfferType[] = ['apartment', 'house', 'room', 'hotel'];

export const Cities = {
  Paris: 'Paris',
  Cologne: 'Cologne',
  Brussels: 'Brussels',
  Amsterdam: 'Amsterdam',
  Hamburg: 'Hamburg',
  Dusseldorf: 'Dusseldorf',
} as const;

export type City = keyof typeof Cities;
export const citiesList: City[] = ['Paris', 'Cologne', 'Brussels', 'Amsterdam', 'Hamburg', 'Dusseldorf'];

export const FacilitiesTypes = {
  Breakfast: 'Breakfast',
  Conditioning: 'Air conditioning',
  Laptop: 'Laptop',
  Workspace: 'friendly workspace',
  Babyseat: 'Baby seat',
  Washer: 'Washer',
  Towels: 'Towels',
  Fridge: 'Fridge',
} as const;

type FacilitiesTypeKeys = keyof typeof FacilitiesTypes
export type FacilitiesType = (typeof FacilitiesTypes)[FacilitiesTypeKeys];

export type Coordinate = {
  latitude: string,
  longitude: string,
}

export type Images = string[];

export class CoordinatesValidation {
  public latitude!: string;
  public longitude!: string;
}
