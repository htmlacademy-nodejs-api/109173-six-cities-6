// Интерфейс для работы с базой данных (сущность: User)
import { DocumentType } from '@typegoose/typegoose';
import { UserEntity } from './user.entity.js';
import { CreateUserDTO } from './dto/create-user.dto.js';
import { LoginUserDTO } from './dto/login-user.dto.js';
import { UpdateUserDTO } from './dto/update-user.dto.js';

export type UserToken = {
  token: string;
}

export type UserDoc = DocumentType<UserEntity>;
export type FoundUser = Promise<UserDoc | null>

export interface UserService {
  create(dto: CreateUserDTO, salt: string): Promise<UserDoc>;
  updateById(userId: string, dto: UpdateUserDTO): FoundUser;
  login(dto: LoginUserDTO, salt: string): UserToken | null;
  logout(token: UserToken): void;
  findById(id: string): FoundUser;
  findByEmail(email: string): FoundUser;
  findOrCreate(dto: CreateUserDTO, salt: string): Promise<UserDoc>;
}
