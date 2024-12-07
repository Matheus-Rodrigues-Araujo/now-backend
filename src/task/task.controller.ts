import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Post,
  UseGuards,
} from '@nestjs/common';
import { Task } from '@prisma/client';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { CreateTaskDto } from './dto/create-task.dto';
import { TaskService } from './task.service';
import { ProjectAdminGuard } from 'src/project/guards/project-admin.guard';

@Controller('projects/:projectId/boards/:boardId/tasks')
@UseGuards(JwtAuthGuard)
export class TaskController {
  constructor(private taskService: TaskService) {}

  @Post()
  @UseGuards(ProjectAdminGuard)
  async createTask(
    @Param('boardId', ParseIntPipe) boardId: number,
    @Body() createTaskDto: CreateTaskDto,
  ): Promise<Task> {
    return await this.taskService.createTask(boardId, createTaskDto);
  }

  @Delete(':taskId')
  @UseGuards(ProjectAdminGuard)
  async deleteTask(
    @Param('boardId', ParseIntPipe) boardId: number,
    @Param('taskId', ParseIntPipe) taskId: number,
  ): Promise<void> {
    await this.taskService.deleteTask(boardId, taskId);
  }
}

//tasks/1/board/2
