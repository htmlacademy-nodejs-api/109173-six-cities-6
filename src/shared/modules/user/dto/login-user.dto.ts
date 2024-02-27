import { IsAlphanumeric, IsEmail } from 'class-validator';

export class LoginUserDTO {
  @IsEmail()
  public email!: string;

  @IsAlphanumeric()
  public password!: string;
}
