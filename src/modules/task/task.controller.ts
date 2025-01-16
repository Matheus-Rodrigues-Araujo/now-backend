import {
  Body,
  Controller,
  Delete,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Put,
  UseGuards,
} from '@nestjs/common';
import { Task } from '@prisma/client';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CreateTaskDto } from './dto/create-task.dto';
import { TaskService } from './task.service';
import { ProjectAdminGuard } from '../project/guards/project-admin.guard';
import { MoveTaskDto, UpdateTaskDto } from './dto';
import { ProjectGuard } from '../project/guards/project.guard';
import { JwtPayload } from 'src/common/interfaces';
import { CurrentUser } from 'src/common/decorators';
import {
  CreateTaskSwagger,
  UpdateTaskSwagger,
  DeleteTaskSwagger,
  MoveTaskToBoardSwagger,
} from './swagger';

@Controller('projects/:projectId/boards/:boardId/tasks')
@UseGuards(JwtAuthGuard)
export class TaskController {
  constructor(private taskService: TaskService) {}

  @Post()
  @UseGuards(ProjectAdminGuard)
  @CreateTaskSwagger.operation
  @CreateTaskSwagger.okResponse
  @CreateTaskSwagger.badRequest
  async createTask(
    @Param('boardId', ParseIntPipe) boardId: number,
    @Body() createTaskDto: CreateTaskDto,
    @CurrentUser() user: JwtPayload['user'],
  ): Promise<Task> {
    return await this.taskService.createTask(user, boardId, createTaskDto);
  }

  @Put(':taskId')
  @UseGuards(ProjectAdminGuard)
  @UpdateTaskSwagger.operation
  @UpdateTaskSwagger.okResponse
  @UpdateTaskSwagger.badRequest
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
  @DeleteTaskSwagger.operation
  @DeleteTaskSwagger.okResponse
  @DeleteTaskSwagger.badRequest
  async deleteTask(
    @Param('boardId', ParseIntPipe) boardId: number,
    @Param('taskId', ParseIntPipe) taskId: number,
    @CurrentUser() user: JwtPayload['user'],
  ): Promise<void> {
    await this.taskService.deleteTask(boardId, taskId, user);
  }

  @Patch('move/:taskId')
  @UseGuards(ProjectGuard)
  @MoveTaskToBoardSwagger.operation
  @MoveTaskToBoardSwagger.okResponse
  @MoveTaskToBoardSwagger.badRequest
  async moveTaskToBoard(
    @Param('boardId', ParseIntPipe) boardId: number,
    @Param('taskId', ParseIntPipe) taskId: number,
    @Body() moveTaskDto: MoveTaskDto,
  ): Promise<Task> {
    return await this.taskService.moveTaskToBoard(boardId, taskId, moveTaskDto);
  }
}
