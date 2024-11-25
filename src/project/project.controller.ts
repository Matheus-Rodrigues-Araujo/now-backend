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
} from '@nestjs/common';
import { ProjectService } from './project.service';
import { Project } from '@prisma/client';
import { AuthGuard } from 'src/auth/auth.guard';
import { AddUsersToProjectDto, CreateProjectDto } from './dto';
import { AuthenticateRequest } from 'src/types';

@Controller('projects')
@UseGuards(AuthGuard)
export class ProjectController {
  constructor(private projectService: ProjectService) {}

  @Get()
  async findAll(): Promise<Project[]> {
    return await this.projectService.findAll();
  }

  @Get(':id')
  async get(@Param('id', ParseIntPipe) id: number): Promise<Project> {
    return await this.projectService.findOne(id);
  }

  @Post()
  async createAdminProject(
    @Body() project: CreateProjectDto,
    @Request() req: AuthenticateRequest,
  ): Promise<Project> {
    const { sub } = req.user;

    return await this.projectService.createAdminProject(sub, project);
  }

  @Get(':projectId/users')
  async findProjectMembers(
    @Param('projectId', ParseIntPipe) projectId: number,
    @Request() req: AuthenticateRequest,
  ) {
    const { sub } = req.user;
    return await this.projectService.findProjectMembers(projectId, sub);
  }

  @Post(':projectId/users')
  async addUsersToProject(
    @Param('projectId', ParseIntPipe) projectId: number,
    @Request() req: AuthenticateRequest,
    @Body() body: AddUsersToProjectDto,
  ) {
    const { usersIds } = body;
    const { sub } = req.user;
    return await this.projectService.addUsersToProject(
      projectId,
      sub,
      usersIds,
    );
  }

  @Delete(':id')
  async delete(@Param('id', ParseIntPipe) id: number): Promise<void> {
    await this.projectService.delete(id);
  }
}
