import { Controller, Get, Request, UseGuards } from '@nestjs/common';
import { AuthGuard } from 'src/auth/auth.guard';
import { AuthenticateRequest } from 'src/types';
import { UserService } from './user.service';

@Controller('users')
@UseGuards(AuthGuard)
export class UserController {
  constructor(private userService: UserService) {}

  @Get('me')
  me(@Request() req: AuthenticateRequest) {
    const { firstName, lastName, sub } = req.user;
    return {
      firstName,
      lastName,
      sub,
    };
  }

  @Get('projects')
  async findProjectsForUser(@Request() req: AuthenticateRequest) {
    const { sub } = req.user;
    return this.userService.findProjectsForUser(sub);
  }
}
