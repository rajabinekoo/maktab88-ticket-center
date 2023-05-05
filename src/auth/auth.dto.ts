import { IsEmail, IsNotEmpty } from 'class-validator';

export class LoginInfoDto {
  @IsEmail()
  email: string;

  @IsNotEmpty()
  password: string;
}
