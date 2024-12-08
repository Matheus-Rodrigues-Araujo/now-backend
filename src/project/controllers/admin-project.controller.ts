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
  ) {
    return await this.projectRepository.update(projectId, updateProjectDto);
  }

  @Delete(':projectId')
  async delete(@Param('projectId', ParseIntPipe) projectId: number) {
    await this.projectRepository.delete(projectId);
  }
}
