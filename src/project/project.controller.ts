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
  Put,
} from '@nestjs/common';
import { ProjectService } from './project.service';
import { Project } from '@prisma/client';
import { AuthGuard } from 'src/auth/auth.guard';
import {
  AddUsersToProjectDto,
  CreateProjectDto,
  FindProjectDto,
  UpdateProjectDto,
} from './dto';
import { AuthenticateRequest, FormattedProject } from 'src/types';
import { ProjectMemberService } from './project-member.service';

@Controller('projects')
@UseGuards(AuthGuard)
export class ProjectController {
  constructor(
    private projectService: ProjectService,
    private projectMemberService: ProjectMemberService,
  ) {}

  @Get()
  async findAll(): Promise<Project[]> {
    return await this.projectService.findAll();
  }

  @Get('find')
  async findOneByIdOrTitle(
    @Query() query: FindProjectDto,
    @Request() req: AuthenticateRequest,
  ): Promise<FormattedProject> {
    const userId = req.user.sub;
    return await this.projectService.findOneByIdOrTitle(query, userId);
  }

  @Post()
  async createAdminProject(
    @Body() project: CreateProjectDto,
    @Request() req: AuthenticateRequest,
  ): Promise<Project> {
    const userId = req.user.sub;

    return await this.projectService.createProjectAsAdmin(project, userId);
  }

  @Get(':projectId/users')
  async findProjectMembers(
    @Param('projectId', ParseIntPipe) projectId: number,
    @Request() req: AuthenticateRequest,
  ) {
    const userId = req.user.sub;
    return await this.projectMemberService.findProjectMembers(projectId, userId);
  }

  @Post(':projectId/users')
  async addUsersToProject(
    @Param('projectId', ParseIntPipe) projectId: number,
    @Request() req: AuthenticateRequest,
    @Body() body: AddUsersToProjectDto,
  ) {
    const { usersIds } = body;
    const userId = req.user.sub;
    return await this.projectMemberService.addUsersToProject(
      projectId,
      userId,
      usersIds,
    );
  }

  @Put(':id')
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateProjectDto: UpdateProjectDto,
    @Request() req: AuthenticateRequest,
  ) {
    const userId = req.user.sub;
    return await this.projectService.update(updateProjectDto, id, userId);
  }

  @Delete(':id')
  async delete(
    @Param('id', ParseIntPipe) id: number,
    @Request() req: AuthenticateRequest,
  ) {
    const userId = req.user.sub;
    await this.projectService.delete(id, userId);
  }
}
