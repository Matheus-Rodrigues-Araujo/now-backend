import {
  Body,
  Controller,
  Get,
  Post,
  Request,
  UseGuards,
} from '@nestjs/common';
import { AuthLoginDto, AuthRegisterDto } from './dto';
import { AuthService } from './auth.service';
import { User } from '@prisma/client';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('login')
  async login(@Body() authLogin: AuthLoginDto) {
    return await this.authService.login(authLogin);
  }

  @Post('register')
  async register(@Body() authRegister: AuthRegisterDto): Promise<User> {
    return await this.authService.register(authRegister);
  }
}
