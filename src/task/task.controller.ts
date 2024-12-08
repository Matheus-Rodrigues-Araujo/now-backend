import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Put,
  UseGuards,
} from '@nestjs/common';
import { Task } from '@prisma/client';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { CreateTaskDto } from './dto/create-task.dto';
import { TaskService } from './task.service';
import { ProjectAdminGuard } from 'src/project/guards/project-admin.guard';
import { UpdateTaskDto } from './dto/update-task.dto';

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

  @Put(':taskId')
  @UseGuards(ProjectAdminGuard)
  async updateTask(
    @Param('taskId', ParseIntPipe) boardId: number,
    @Body() updateTaskDto: UpdateTaskDto,
  ): Promise<Task> {
    return await this.taskService.updateTask(boardId, updateTaskDto);
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