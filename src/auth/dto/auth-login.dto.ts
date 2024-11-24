import { IsString, IsEmail, IsNotEmpty } from 'class-validator';

export class AuthLogin {
  @IsNotEmpty()
  @IsEmail()
  email: string;

  @IsString()
  @IsNotEmpty()
  hash: string;
}
