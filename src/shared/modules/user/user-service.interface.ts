// Интерфейс для работы с базой данных (сущность: User)
import { DocumentType } from '@typegoose/typegoose';
import { UserEntity } from './user.entity.js';
import { CreateUserDTO } from './dto/create-user.dto.js';
import { UpdateUserDTO } from './dto/update-user.dto.js';
import { FoundOffers } from '../offer/offer-service.interface.js';
import { ServiceEntityName } from '../../types/service-entity-name.interface.js';

export type UserToken = string;
export type UserDoc = DocumentType<UserEntity>;
export type FoundUser = Promise<UserDoc | null>

export interface UserService extends ServiceEntityName {
  create(dto: CreateUserDTO, salt: string): Promise<UserDoc>;
  updateById(id: string, dto: UpdateUserDTO): FoundUser;
  checkAuthStatus(email: string): FoundUser;

  findById(id: string): FoundUser;
  findByEmail(email: string): FoundUser;
  findOrCreate(dto: CreateUserDTO, salt: string): Promise<UserDoc>;

  getFavoriteOffers(userId: string): FoundOffers;
  addToFavoritesIds(userId: string, offerId: string): FoundUser;
  removeFromFavoritesIds(userId: string, offerId: string): FoundUser
  getFavoriteIds(userId: string): Promise<string[] | []>;

  exists(userId: string): Promise<boolean>;
}
