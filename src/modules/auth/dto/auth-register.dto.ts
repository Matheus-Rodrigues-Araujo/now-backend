import { IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { AuthLoginDto } from './auth-login.dto';

export class AuthRegisterDto extends AuthLoginDto {
  @IsString()
  @IsNotEmpty()
  firstName: string;

  @IsString()
  @IsOptional()
  lastName?: string;
}
