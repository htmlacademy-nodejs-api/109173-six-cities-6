import { types } from '@typegoose/typegoose';
import * as mongoose from 'mongoose';
import { CreateOfferDTO } from './dto/create-offer.dto.js';
import { FoundOffer, FoundOffers, OfferDoc, OfferService } from './offer-service.interface.js';
import { OfferEntity } from './offer.entity.js';
import { inject, injectable } from 'inversify';
import { Component } from '../../types/component.enum.js';
import { Logger } from '../../libs/logger/logger.interface.js';
import { UpdateOfferDTO } from './dto/update-offer.dto.js';
import { City } from '../../types/city-type.enum.js';
import { SortType } from '../../types/sort-type.enum.js';

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

  public async updateById(id: string, dto: UpdateOfferDTO): FoundOffer {
    return await this.offerModel
      .findByIdAndUpdate(id, dto, { new: true })
      .exec();
  }

  public async deleteById(id: string): FoundOffer {
    return await this.offerModel
      .findByIdAndDelete(id)
      .exec();
  }

  public async find(offersCount: number = DEFAULT_OFFERS_COUNT): FoundOffers {
    return await this.offerModel
      .find()
      .limit(offersCount)
      .sort({ createdAt: SortType.DOWN })
      .exec();
  }

  public async findById(id: string): FoundOffer {
    return await this.offerModel
      .findById({ id })
      .populate('userId')
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

  public async changeFavoriteStatus(id: string, status: boolean): FoundOffer {
    return await this.offerModel
      .findByIdAndUpdate(id, { isFavorite: status }, { new: true })
      .exec();
  }

  public async incCommentsCount(id: string): FoundOffer {
    return this.offerModel
      .findByIdAndUpdate(id, {
        '$inc': { commentCount: 1 }
      }).exec();
  }

  public async countComments(id: string): Promise<number | void> {
    const offerObjectId = new mongoose.Types.ObjectId(id);
    const [ offer ] = await this.offerModel
      .aggregate([
        { $match: { _id: offerObjectId} }, // Берем из коллекции Offers элемент с _id = id
        { // Выбираем все соответствующие комментарии
          $lookup: {
            from: 'comments',
            let: { targetOfferId: id },
            pipeline: [
              { $match: { $expr: { $eq: [ '$$targetOfferId', '$offerId' ] } } }, // $expr позволяет нам обращаться к let
              { $project: { _id: 1 } }
            ],
            as: 'offersCommentsCount',
          }
        },
        { // Считаем комментарии и записываем в commentCount поле документа из коллекции Offers
          $addFields: { commentCount: { $size: '$offersCommentsCount' } }
        },
        { $unset: 'offersCommentsCount' } // Удаляем временную переменную
      ])
      .exec();

    if(!offer) {
      return;
    }

    return offer.commentCount;
  }

  public async updateCommentsCount(id: string): FoundOffer {
    const commentCount = await this.countComments(id);

    if(!commentCount) {
      return null;
    }

    return await this.updateById(id, { commentCount });
  }

  countRating(id: string): Promise<number | void> {

  }

  updateRating(id: string): FoundOffer {

  }
}
