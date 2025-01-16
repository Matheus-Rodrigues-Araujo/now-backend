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
import { FormattedProject, JwtPayload } from 'src/common/interfaces';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { CurrentUser } from 'src/common/decorators';
import {
  CreateProjectSwagger,
  FindMembersSwagger,
  FindProjectSwagger,
} from '../swagger/project';

@Controller('projects')
@UseGuards(JwtAuthGuard)
export class ProjectController {
  constructor(private projectService: ProjectService) {}

  @Post()
  @CreateProjectSwagger.operation
  @CreateProjectSwagger.okResponse
  @CreateProjectSwagger.badRequest
  async createProject(
    @Body() createProjectDto: CreateProjectDto,
    @CurrentUser() user: JwtPayload['user'],
  ) {
    return await this.projectService.createProject(user, createProjectDto);
  }

  @Get('find')
  @FindProjectSwagger.operation
  @FindProjectSwagger.okResponse
  @FindProjectSwagger.badRequest
  @FindProjectSwagger.notFound
  @UseGuards(ProjectGuard)
  async findProjectByIdOrTitle(
    @Query() query: FindProjectDto,
    @CurrentUser() user: JwtPayload['user'],
  ): Promise<FormattedProject> {
    const userId = user.sub;
    return await this.projectService.findProjectByIdOrTitle(query, userId);
  }

  @Get(':projectId/members')
  @UseGuards(ProjectGuard)
  @FindMembersSwagger.operation
  @FindMembersSwagger.okResponse
  @FindMembersSwagger.badRequest
  @FindMembersSwagger.notFound
  async findProjectMembers(
    @Param('projectId', ParseIntPipe) projectId: number,
  ) {
    return await this.projectService.findProjectMembers(projectId);
  }
}
