import { IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { AuthLogin } from './auth-login.dto';

export class AuthRegister extends AuthLogin {
  @IsString()
  @IsNotEmpty()
  firstName: string;

  @IsString()
  @IsOptional()
  lastName?: string;
}
