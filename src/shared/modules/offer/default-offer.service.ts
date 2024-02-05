import { DocumentType, types } from '@typegoose/typegoose';
import { CreateOfferDTO } from './dto/create-offer.dto.js';
import { OfferService } from './offer-service.interface.js';
import { OfferEntity, OfferModel } from './offer.entity.js';

export class DefaultOfferService implements OfferService {
  constructor(
    private readonly offerModel: types.ModelType<OfferEntity> = OfferModel
  ){}

  public async create(dto: CreateOfferDTO): Promise<DocumentType<OfferEntity>> {
    const offer = await this.offerModel.create(dto);

    return offer;
  }

  public async findById(id: string): Promise<DocumentType<OfferEntity> | null> {
    return await this.offerModel.findById({ id }).exec();
  }
}
