import {
  Body,
  Controller,
  Delete,
  Param,
  ParseIntPipe,
  Put,
  UseGuards,
  Post,
} from '@nestjs/common';
import { ProjectAdminGuard } from '../guards/project-admin.guard';
import { AddUsersToProjectDto, UpdateProjectDto } from '../dto';
import { ProjectRepository } from '../project.repository';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { CurrentUser } from 'src/common/decorators';
import { JwtPayload } from 'src/common/interfaces';

@Controller('admin/projects')
@UseGuards(JwtAuthGuard, ProjectAdminGuard)
export class AdminProjectController {
  constructor(private readonly projectRepository: ProjectRepository) {}

  @Post(':projectId/users')
  async addUsersToProject(
    @Param('projectId', ParseIntPipe) projectId: number,
    @Body() body: AddUsersToProjectDto,
  ) {
    const { usersIds } = body;
    return await this.projectRepository.addUsersToProject(projectId, usersIds);
  }

  @Put(':projectId')
  async updateProject(
    @Param('projectId', ParseIntPipe) projectId: number,
    @Body() updateProjectDto: UpdateProjectDto,
    @CurrentUser() user: JwtPayload['user'],
  ) {
    return await this.projectRepository.updateProject(
      projectId,
      user,
      updateProjectDto,
    );
  }

  @Delete(':projectId')
  async delete(
    @Param('projectId', ParseIntPipe) projectId: number,
    @CurrentUser() user: JwtPayload['user'],
  ) {
    await this.projectRepository.deleteProject(projectId, user);
  }
}
