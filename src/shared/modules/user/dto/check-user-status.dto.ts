import { IsEmail } from 'class-validator';

export class CheckUserStatusDTO {
  @IsEmail()
  public email!: string;
}
