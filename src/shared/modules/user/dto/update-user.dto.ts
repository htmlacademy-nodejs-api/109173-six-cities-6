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
import { UserProps } from '../user.constant.js';
import { UserErrorText } from './create-user.messages.js';

export class UpdateUserDTO {
  @MaxLength(UserProps.name.MAX_LENGTH, { message: UserErrorText.name.MAX })
  @MinLength(UserProps.name.MIN_LENGTH, { message: UserErrorText.name.MIN })
  @IsString()
  @IsOptional()
  public name?: string;

  @IsEmail()
  @IsOptional()
  public email?: string;

  @IsString()
  @IsOptional()
  public avatarUrl?: string;

  @MaxLength(UserProps.password.MAX_LENGTH, { message: UserErrorText.password.MAX })
  @MinLength(UserProps.password.MIN_LENGTH, { message: UserErrorText.password.MIN })
  @IsAlphanumeric()
  @IsOptional()
  public password?: string;

  @IsBoolean()
  @IsOptional()
  public isPro?: boolean;

  @IsMongoId({ each: true })
  @IsArray()
  @IsOptional()
  public favoriteOffers?: string[];
}
