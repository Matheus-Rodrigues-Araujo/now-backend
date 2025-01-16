import { Body, Controller, Get, Post } from '@nestjs/common';
import { AuthLoginDto, AuthRegisterDto } from './dto';
import { AuthService } from './auth.service';
import { User } from '@prisma/client';
import { LoginSwagger, RegisterSwagger } from './swagger';
@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('login')
  @LoginSwagger.operation
  @LoginSwagger.okResponse
  @LoginSwagger.badRequest
  @LoginSwagger.unauthorized
  async login(@Body() authLogin: AuthLoginDto) {
    return await this.authService.login(authLogin);
  }

  @Post('register')
  @RegisterSwagger.operation
  @RegisterSwagger.okResponse
  @RegisterSwagger.badRequest
  @RegisterSwagger.unauthorized
  async register(@Body() authRegister: AuthRegisterDto): Promise<User> {
    return await this.authService.register(authRegister);
  }
}
