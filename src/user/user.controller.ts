import { Controller, Get, Request, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { JwtPayload } from 'src/types';
import { UserService } from './user.service';

@Controller('users')
@UseGuards(JwtAuthGuard)
export class UserController {
  constructor(private userService: UserService) {}

  @Get('me')
  me(@Request() req: JwtPayload) {
    const { firstName, lastName, sub } = req.user;
    return {
      firstName,
      lastName,
      sub,
    };
  }

  @Get('projects')
  async findProjectsForUser(@Request() req: JwtPayload) {
    const { sub } = req.user;
    return this.userService.findProjectsForUser(sub);
  }
}
