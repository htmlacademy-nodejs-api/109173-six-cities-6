import { ServiceEntityName } from '../../types/service-entity-name.interface.js';
import { LoginUserDTO } from '../user/dto/login-user.dto.js';
import { UserEntity } from '../user/user.entity.js';

export interface AuthService extends ServiceEntityName {
  authenticate(user: UserEntity): Promise<string>
  check(dto: LoginUserDTO): Promise<UserEntity>
}
