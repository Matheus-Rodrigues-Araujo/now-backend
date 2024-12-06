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

  @Post(':id/users')
  async addUsersToProject(
    @Param('id', ParseIntPipe) projectId: number,
    @Body() body: AddUsersToProjectDto,
  ) {
    const { usersIds } = body;
    return await this.projectRepository.addUsersToProject(projectId, usersIds);
  }

  @Put(':id')
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateProjectDto: UpdateProjectDto,
  ) {
    return await this.projectRepository.update(id, updateProjectDto);
  }

  @Delete(':id')
  async delete(@Param('id', ParseIntPipe) id: number) {
    await this.projectRepository.deleteWithDependencies(id);
  }
}
