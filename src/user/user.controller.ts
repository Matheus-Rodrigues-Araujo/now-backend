import { Controller, Get, Request, UseGuards } from '@nestjs/common';
import { AuthGuard } from 'src/auth/auth.guard';

@Controller('users')
export class UserController {
    
  @UseGuards(AuthGuard)
  @Get('me')
  me(@Request() req: any) {
    const { firstName, lastName, sub } = req.user;
    return {
      firstName,
      lastName,
      sub,
    };
  }
}
