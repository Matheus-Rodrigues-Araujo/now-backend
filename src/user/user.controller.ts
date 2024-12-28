import { Controller, Get, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { JwtPayload } from 'src/common/interfaces';
import { UserService } from './user.service';
import { CurrentUser } from 'src/common/decorators';
import {
  ApiBadRequestResponse,
  ApiOkResponse,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';

@Controller('users')
@UseGuards(JwtAuthGuard)
export class UserController {
  constructor(private userService: UserService) {}

  /**
   * Get user information
   */
  @Get('me')
  @ApiUnauthorizedResponse()
  me(@CurrentUser() user: JwtPayload['user']) {
    const { firstName, lastName } = user;
    return {
      firstName,
      lastName,
    };
  }

  /**
   * Find all the user's projects
   */
  @Get('projects')
  @ApiOkResponse({ type: Object, isArray: true })
  @ApiBadRequestResponse({ description: 'Faild to fetch project members' })
  @ApiUnauthorizedResponse({ description: 'Access denied' })
  async findProjectsForUser(@CurrentUser() user: JwtPayload['user']) {
    const userId = user.sub;
    return this.userService.findProjectsForUser(userId);
  }
}
