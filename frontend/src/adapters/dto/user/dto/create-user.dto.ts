// Интерфейс (контракт) передачи данных в сервис для дальнейшей работы с сущностью User
export class CreateUserDTO {
  public name!: string;
  public email!: string;
  public avatarUrl!: string;
  public password!: string;
  public isPro!: boolean;
  public favoriteOffers!: string[];
}
