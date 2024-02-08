// Интерфейс для работы с базой данных (сущность: User)
import { DocumentType } from '@typegoose/typegoose';
import { UserEntity } from './user.entity.js';
import { CreateUserDTO } from './dto/create-user.dto.js';

export interface UserService {
  create(dto: CreateUserDTO, salt: string): Promise<DocumentType<UserEntity>>;
  findById(id: string): Promise<DocumentType<UserEntity> | null>;
  findByEmail(email: string): Promise<DocumentType<UserEntity> | null>;
  findOrCreate(dto: CreateUserDTO, salt: string): Promise<DocumentType<UserEntity>>;
}
