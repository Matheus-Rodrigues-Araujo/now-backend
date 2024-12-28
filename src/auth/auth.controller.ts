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
import {
  ApiBadRequestResponse,
  ApiOkResponse,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  /**
   * Log in the user
   */
  @Post('login')
  @ApiOkResponse({ type: Object, description: 'Login successful' })
  @ApiBadRequestResponse({ description: 'Could not sign in' })
  @ApiUnauthorizedResponse({ description: 'Invalid email or password' })
  async login(@Body() authLogin: AuthLoginDto) {
    return await this.authService.login(authLogin);
  }

  /**
   * Register new user
   */
  @Post('register')
  @ApiOkResponse({ type: Object, description: 'Login successful' })
  @ApiBadRequestResponse({ description: 'User not registered' })
  @ApiUnauthorizedResponse({
    description:
      'A user account with the provided email or username already exists.',
  })
  async register(@Body() authRegister: AuthRegisterDto): Promise<User> {
    return await this.authService.register(authRegister);
  }
}
