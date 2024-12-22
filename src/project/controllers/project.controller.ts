import {
  Body,
  Controller,
  Get,
  Post,
  Param,
  ParseIntPipe,
  UseGuards,
  Query,
} from '@nestjs/common';
import { ProjectGuard } from '../guards/project.guard';
import { CreateProjectDto, FindProjectDto } from '../dto';
import { ProjectService } from '../services/project.service';
import { FormattedProject, JwtPayload } from 'src/types';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { CurrentUser } from 'src/common/decorators';

@Controller('projects')
@UseGuards(JwtAuthGuard)
export class ProjectController {
  constructor(private projectService: ProjectService) {}

  @Post()
  async createAdminProject(
    @Body() createProjectDto: CreateProjectDto,
    @CurrentUser() user: JwtPayload['user'],
  ) {
    return await this.projectService.createAdminProject(user, createProjectDto);
  }

  @Get('find')
  @UseGuards(ProjectGuard)
  async findProjectByIdOrTitle(
    @Query() query: FindProjectDto,
    @CurrentUser() user: JwtPayload['user'],
  ): Promise<FormattedProject> {
    const userId = user.sub;
    return await this.projectService.findProjectByIdOrTitle(query, userId);
  }

  @Get(':projectId/users')
  @UseGuards(ProjectGuard)
  async findProjectMembers(
    @Param('projectId', ParseIntPipe) projectId: number,
  ) {
    return await this.projectService.findProjectMembers(projectId);
  }
}
