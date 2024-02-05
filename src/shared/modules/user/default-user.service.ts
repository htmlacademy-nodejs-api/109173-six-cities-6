// Слой-сервис, через который осуществляется взаимодействие с БД (сущность: User)
import { DocumentType } from '@typegoose/typegoose';
import { CreateUserDTO, UserEntity, UserModel } from './index.js';
import { UserService } from './user-service.interface.js';

export class DefaultUserService implements UserService {
  public async create(dto: CreateUserDTO, salt: string): Promise<DocumentType<UserEntity>> {
    const user = new UserEntity(dto);
    user.setPassword(dto.password, salt);

    return await UserModel.create(user);
  }

  public async findById(id: string): Promise<DocumentType<UserEntity> | null> {
    return await UserModel.findById({ id });
  }

  public async findByEmail(email: string): Promise<DocumentType<UserEntity> | null> {
    return await UserModel.findOne({ email });
  }

  public async findOrCreate(dto: CreateUserDTO, salt: string): Promise<DocumentType<UserEntity>> {
    const existedUser = await this.findByEmail(dto.email);

    if(existedUser) {
      return existedUser;
    }

    return this.create(dto, salt);
  }
}
