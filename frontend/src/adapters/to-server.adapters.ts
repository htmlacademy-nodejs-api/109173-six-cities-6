import { UserRegister } from '../types/types';
import { CreateUserDTO } from './dto/user/dto/create-user.dto';

export function adaptUserToServer(data: UserRegister): CreateUserDTO {
  return {
    name: data.name,
    email: data.email,
    password: data.password,
    avatarUrl: `${data.avatar?.name}`,
    isPro: Boolean(data.type),
    favoriteOffers: []
  };
}
