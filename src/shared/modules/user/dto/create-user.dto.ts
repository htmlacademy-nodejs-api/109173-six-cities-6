// Интерфейс (контракт) передачи данных в сервис для дальнейшей работы с сущностью User
import { User } from '../../../types/user.type.js';

export class CreateUserDTO implements User {
  public name!: string;
  public email!: string;
  public avatarUrl!: string;
  public password!: string;
  public isPro!: boolean;
  public favoriteOffers!: string[];
}
