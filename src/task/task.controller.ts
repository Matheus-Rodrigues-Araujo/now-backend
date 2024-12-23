import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Put,
  Query,
  UseGuards,
  Request,
} from '@nestjs/common';
import { Task } from '@prisma/client';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { CreateTaskDto } from './dto/create-task.dto';
import { TaskService } from './task.service';
import { ProjectAdminGuard } from 'src/project/guards/project-admin.guard';
import { MoveTaskDto, UpdateTaskDto } from './dto';
import { ProjectGuard } from 'src/project/guards/project.guard';
import { JwtPayload } from 'src/common/interfaces';
import { CurrentUser } from 'src/common/decorators';

@Controller('projects/:projectId/boards/:boardId/tasks')
@UseGuards(JwtAuthGuard)
export class TaskController {
  constructor(private taskService: TaskService) {}

  @Post()
  @UseGuards(ProjectAdminGuard)
  async createTask(
    @Param('boardId', ParseIntPipe) boardId: number,
    @Body() createTaskDto: CreateTaskDto,
    @CurrentUser() user: JwtPayload['user'],
  ): Promise<Task> {
    return await this.taskService.createTask(user, boardId, createTaskDto);
  }

  @Put(':taskId')
  @UseGuards(ProjectAdminGuard)
  async updateTask(
    @Param('taskId', ParseIntPipe) taskId: number,
    @Body() updateTaskPayload: { data: UpdateTaskDto },
    @CurrentUser() user: JwtPayload['user'],
  ): Promise<Task> {
    return await this.taskService.updateTask(
      taskId,
      user,
      updateTaskPayload.data,
    );
  }

  @Delete(':taskId')
  @UseGuards(ProjectAdminGuard)
  async deleteTask(
    @Param('boardId', ParseIntPipe) boardId: number,
    @Param('taskId', ParseIntPipe) taskId: number,
    @CurrentUser() user: JwtPayload['user'],
  ): Promise<void> {
    await this.taskService.deleteTask(boardId, taskId, user);
  }

  @Patch('move/:taskId')
  @UseGuards(ProjectGuard)
  async moveTaskToBoard(
    @Param('boardId', ParseIntPipe) boardId: number,
    @Param('taskId', ParseIntPipe) taskId: number,
    @Body() moveTaskDto: MoveTaskDto,
  ): Promise<Task> {
    return await this.taskService.moveTaskToBoard(boardId, taskId, moveTaskDto);
  }
}
