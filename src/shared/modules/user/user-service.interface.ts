// Интерфейс для работы с базой данных (сущность: User)
import { DocumentType } from '@typegoose/typegoose';
import { UserEntity } from './user.entity.js';
import { CreateUserDTO } from './dto/create-user.dto.js';
import { LoginUserDTO } from './dto/login-user.dto.js';
import { UpdateUserDTO } from './dto/update-user.dto.js';
import { FoundOffers } from '../offer/offer-service.interface.js';

export type UserToken = string;
export type UserDoc = DocumentType<UserEntity>;
export type FoundUser = Promise<UserDoc | null>

export interface UserService {
  create(dto: CreateUserDTO, salt: string): Promise<UserDoc>;
  updateById(id: string, dto: UpdateUserDTO): FoundUser;
  login(dto: LoginUserDTO, salt: string): Promise<UserToken | null>;
  logout(token: UserToken): void;
  checkAuthStatus(email: string): FoundUser;
  findById(id: string): FoundUser;
  findByEmail(email: string): FoundUser;
  findOrCreate(dto: CreateUserDTO, salt: string): Promise<UserDoc>;
  addToFavoritesIds(userId: string, offerId: string): FoundUser;
  getFavoriteIds(userId: string): Promise<string[] | []>;
  getFavoriteOffers(userId: string): FoundOffers;
  exists(userId: string): Promise<boolean>;
}
