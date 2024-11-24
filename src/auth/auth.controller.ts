import { Body, Controller, Get, Post, Request, UseGuards } from '@nestjs/common';
import { AuthLogin, AuthRegister } from './dto';
import { AuthService } from './auth.service';
import { User } from '@prisma/client';
// import { AuthGuard } from './auth.guard';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('login')
  async login(@Body() authLogin: AuthLogin) {
    return await this.authService.login(authLogin);
  }

  @Post('register')
  async register(@Body() authRegister: AuthRegister): Promise<User> {
    return await this.authService.register(authRegister);
  }

  // @UseGuards(AuthGuard)
  // @Get('me')
  // async me(@Request() req:any){
  //   return {
  //     sub: req.user.sub,
  //     firstName: req.user.firstName,
  //     lastName: req.user?.lastName,
  //   }
  // }

}
