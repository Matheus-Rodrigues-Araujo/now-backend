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
import { CreateProjectDto } from './dto';

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
  async create(@Body() project: CreateProjectDto, @Request() req: any): Promise<Project> {
    const { sub } = req.user

    return await this.projectService.create(sub, project);
  }

  @Delete(':id')
  async delete(@Param('id', ParseIntPipe) id: number): Promise<void> {
    await this.projectService.delete(id);
  }
}
