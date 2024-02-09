import { types } from '@typegoose/typegoose';
import { CreateOfferDTO } from './dto/create-offer.dto.js';
import { FoundOffer, FoundOffers, OfferDoc, OfferService } from './offer-service.interface.js';
import { OfferEntity } from './offer.entity.js';
import { inject, injectable } from 'inversify';
import { Component } from '../../types/component.enum.js';
import { Logger } from '../../libs/logger/logger.interface.js';
import { UpdateOfferDTO } from './dto/update-offer.dto.js';
import { City } from '../../types/city-type.enum.js';

const DEFAULT_OFFERS_COUNT = 60;
const DEFAULT_PREMIUM_OFFERS_COUNT = 3;

const MessageText = {
  ADDED: 'New offer successfully added. Offer ID:',
  EXISTS: 'Offer already exists in database:',
} as const;
@injectable()
export class DefaultOfferService implements OfferService {
  constructor(
    @inject(Component.OfferModel) private readonly offerModel: types.ModelType<OfferEntity>,
    @inject(Component.Logger) private readonly logger: Logger
  ){}

  public async create(dto: CreateOfferDTO): Promise<OfferDoc> {
    const offer = await this.offerModel.create(dto);

    this.logger.info(`${MessageText.ADDED} ${offer.id}`);

    return offer;
  }

  public async updateById(offerId: number, dto: UpdateOfferDTO): FoundOffer {
    return await this.offerModel
      .findByIdAndUpdate(offerId, dto, {new: true})
      .exec();
  }

  public async deleteById(offerId: number): FoundOffer {
    return await this.offerModel
      .findByIdAndDelete(offerId)
      .exec();
  }

  public async find(offersCount: number = DEFAULT_OFFERS_COUNT): FoundOffers {
    return await this.offerModel
      .find()
      .limit(offersCount)
      .exec();
  }

  public async findById(id: string): FoundOffer {
    return await this.offerModel
      .findById({ id })
      .populate([ 'userId' ])
      .exec();
  }

  public async findOrCreate(dto: CreateOfferDTO): FoundOffer {
    const offer = await this.offerModel.findOne({ name: dto.name, userId: dto.userId }).exec();

    if(offer) {
      this.logger.info(`${MessageText.EXISTS} ${offer.id}`);
      return offer.id;
    }

    return this.create(dto);
  }

  public async getPremiumByCity(city: City, offersCount: number = DEFAULT_PREMIUM_OFFERS_COUNT): FoundOffers {
    return await this.offerModel
      .find({ city })
      .limit(offersCount)
      .exec();
  }

  public async getFavorites(): FoundOffers {
    return await this.offerModel
      .find({ isFavorite: true })
      .exec();
  }

  public async changeFavoriteStatus(offerId: string, status: boolean): FoundOffer {
    return await this.offerModel
      .findByIdAndUpdate({ _id: offerId }, { isFavorite: status }, { new: true })
      .exec();
  }
}
