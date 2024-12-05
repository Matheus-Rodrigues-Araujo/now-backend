import {
  Body,
  Controller,
  Delete,
  Get,
  Post,
  Request,
  Param,
  ParseIntPipe,
  UseGuards,
  Query,
} from '@nestjs/common';
import { ProjectGuard } from 'src/auth/guards/project.guard';
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
  async createAdminAsProject(
    @Body() project: CreateProjectDto,
    @CurrentUser() user: JwtPayload['user'],
  ) {
    const userId = user.sub;
    return await this.projectService.createProjectAsAdmin(project, userId);
  }

  @Get('find')
  @UseGuards(ProjectGuard)
  async findOneByIdOrTitle(
    @Query() query: FindProjectDto,
    @CurrentUser() user: JwtPayload['user'],
  ): Promise<FormattedProject> {
    const userId = user.sub;
    return await this.projectService.findOneByIdOrTitle(query, userId);
  }

  @Get(':id/users')
  @UseGuards(ProjectGuard)
  async findProjectMembers(
    @Param('id', ParseIntPipe) projectId: number,
  ) {
    return await this.projectService.findProjectMembers(projectId);
  }
}
