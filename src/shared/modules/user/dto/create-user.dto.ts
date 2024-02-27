// Интерфейс (контракт) передачи данных в сервис для дальнейшей работы с сущностью User
import {
  IsAlphanumeric,
  IsArray,
  IsBoolean,
  IsEmail,
  IsMongoId,
  IsOptional,
  IsString,
  MaxLength,
  MinLength
} from 'class-validator';
import { User } from '../../../types/user.type.js';
import { UserProps } from '../user.constant.js';
import { UserErrorText } from './create-user.messages.js';

export class CreateUserDTO implements User {
  @MaxLength(UserProps.name.MAX_LENGTH, { message: UserErrorText.name.MAX })
  @MinLength(UserProps.name.MIN_LENGTH, { message: UserErrorText.name.MIN })
  @IsString()
  public name!: string;

  @IsEmail()
  public email!: string;

  @IsString()
  @IsOptional()
  public avatarUrl!: string;

  @MaxLength(UserProps.password.MAX_LENGTH, { message: UserErrorText.password.MAX })
  @MinLength(UserProps.password.MIN_LENGTH, { message: UserErrorText.password.MIN })
  @IsAlphanumeric()
  public password!: string;

  @IsBoolean()
  public isPro!: boolean;

  @IsMongoId({ each: true })
  @IsArray()
  public favoriteOffers!: string[];
}
