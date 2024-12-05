import { Controller, Get, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { JwtPayload } from 'src/types';
import { UserService } from './user.service';
import { CurrentUser } from 'src/common/decorators';

@Controller('users')
@UseGuards(JwtAuthGuard)
export class UserController {
  constructor(private userService: UserService) {}

  @Get('me')
  me(@CurrentUser() user: JwtPayload['user']) {
    const { firstName, lastName } = user;
    return {
      firstName,
      lastName,
    };
  }

  @Get('projects')
  async findProjectsForUser(@CurrentUser() user: JwtPayload['user']) {
    const userId = user.sub;
    return this.userService.findProjectsForUser(userId);
  }
}
