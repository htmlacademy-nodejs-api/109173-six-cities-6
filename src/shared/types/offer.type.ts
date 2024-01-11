import { City } from './city.enum.js'
import { Coordinate } from './coordinate.type.js'
import { FacilitiesType } from './facilities-type.enum.js'
import { OfferType } from './offer-type.js'
import { User } from './user.type.js'

type Images = String[];

export type Offer = {
  name: string,
  description: string,
  date: string,
  city: City,
  previewImage: string,
  images: Images,
  isPremium: boolean,
  isFavorite: boolean,
  rating: number,
  type: typeof OfferType,
  rooms: number,
  guests: number,
  price: number,
  facilities: typeof FacilitiesType,
  author: User,
  comments: number,
  coordinates: Coordinate
}
