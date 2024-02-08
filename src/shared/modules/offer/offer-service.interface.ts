import { DocumentType } from '@typegoose/typegoose';
import { CreateOfferDTO } from './dto/create-offer.dto.js';
import { OfferEntity } from './offer.entity.js';
import { UpdateOfferDTO } from './dto/update-offer.dto.js';

export type OfferDoc = DocumentType<OfferEntity>;
export type FoundOffer = Promise<OfferDoc | null>;
export type FoundOffers = Promise<OfferDoc[] | null>;
export interface OfferService {
  create(dto: CreateOfferDTO): Promise<OfferDoc>
  updateById(offerId: number, dto: UpdateOfferDTO): FoundOffer
  deleteById(offerId: number): FoundOffer
  find(offersCount: number): FoundOffers
  findById(id: string): FoundOffer
  findOrCreate(dto: CreateOfferDTO): FoundOffer
}
