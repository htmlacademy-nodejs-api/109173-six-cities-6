// Описание схемы хранения данных в БД (сущность: User)
import { defaultClasses, getModelForClass, modelOptions, prop } from '@typegoose/typegoose';
import { User } from '../../types/user.type.js';
import { getSHA256Hash } from '../../../utils/hash.js';

// eslint-disable-next-line @typescript-eslint/no-unsafe-declaration-merging
export interface UserEntity extends defaultClasses.Base {}

@modelOptions({
  schemaOptions: {
    collection: 'users',
    timestamps: true
  }
})
// eslint-disable-next-line @typescript-eslint/no-unsafe-declaration-merging
export class UserEntity extends defaultClasses.TimeStamps implements User {
  @prop({ required: true })
  public name: string;

  @prop({
    unique: true,
    required: true,
  })
  public email: string;

  @prop({ default: '' })
  public avatarUrl: string;

  @prop({ default: '', required: true })
  public password: string;

  @prop({ default: false, required: true })
  public isPro: boolean;

  @prop({
    type: () => [String],
    default: []
  })
  public favoriteOffers: string[];

  @prop({ default: '' })
  public token!: string;

  constructor(userData: User) {
    super();

    this.name = userData.name;
    this.email = userData.email;
    this.avatarUrl = userData.avatarUrl;
    this.password = userData.password;
    this.isPro = userData.isPro;
    this.favoriteOffers = userData.favoriteOffers;
  }

  public getPassword() {
    return this.password;
  }

  public getPasswordHash(password: string, salt: string) {
    return getSHA256Hash(password, salt);
  }

  public checkPassword(password: string, salt: string) {
    return this.getPasswordHash(password, salt) === this.password;
  }

  public createAuthToken(email: string, password: string, salt: string): string {
    const currentDate = new Date().toDateString();
    const preparedValue = `${email}${password}${currentDate}`;
    return getSHA256Hash(preparedValue, salt);
  }
}

export const UserModel = getModelForClass(UserEntity);
