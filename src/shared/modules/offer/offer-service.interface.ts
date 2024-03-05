import { DocumentType } from '@typegoose/typegoose';
import { CreateOfferDTO } from './dto/create-offer.dto.js';
import { OfferEntity } from './offer.entity.js';
import { UpdateOfferDTO } from './dto/update-offer.dto.js';
import { City } from '../../types/city-type.enum.js';
import { ServiceEntityName } from '../../types/service-entity-name.interface.js';

export type OfferDoc = DocumentType<OfferEntity>;
export type FoundOffer = Promise<OfferDoc | null>;
export type FoundOffers = Promise<OfferDoc[] | null>;
export type OfferRatingComments = {
  rating: number,
  commentCount: number
};
export interface OfferService extends ServiceEntityName {
  create(dto: CreateOfferDTO): Promise<OfferDoc>;
  updateById(id: string, dto: UpdateOfferDTO): FoundOffer;
  deleteById(id: string): FoundOffer;
  find(offersCount?: number): FoundOffers;
  findById(id: string): Promise<unknown>;
  findOrCreate(dto: CreateOfferDTO): FoundOffer;
  exists(docId: string): Promise<boolean>;
  getPremiumByCity(cityName: City, offersCount?: number): FoundOffers;
  changeFavoriteStatus(offerId: string, status: number): FoundOffer;
  incCommentsCount(id: string): FoundOffer;
  countRatingAndComments(id: string): Promise<OfferRatingComments | void>;
  updateRatingAndComments(id: string): FoundOffer;
  isUserCanEdit(offerId: string, userId: string): Promise<boolean>
}
