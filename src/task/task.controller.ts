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
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { CreateTaskDto } from './dto/create-task.dto';
import { TaskService } from './task.service';
import { ProjectAdminGuard } from 'src/project/guards/project-admin.guard';
import { MoveTaskDto, UpdateTaskDto } from './dto';
import { ProjectGuard } from 'src/project/guards/project.guard';
import { JwtPayload } from 'src/common/interfaces';
import { CurrentUser } from 'src/common/decorators';
import {
  ApiBadRequestResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
} from '@nestjs/swagger';

@Controller('projects/:projectId/boards/:boardId/tasks')
@UseGuards(JwtAuthGuard)
export class TaskController {
  constructor(private taskService: TaskService) {}

  /**
   * Create new task
   */
  @Post()
  @UseGuards(ProjectAdminGuard)
  async createTask(
    @Param('boardId', ParseIntPipe) boardId: number,
    @Body() createTaskDto: CreateTaskDto,
    @CurrentUser() user: JwtPayload['user'],
  ): Promise<Task> {
    return await this.taskService.createTask(user, boardId, createTaskDto);
  }

  /**
   * Update a task
   */
  @Put(':taskId')
  @UseGuards(ProjectAdminGuard)
  @ApiOkResponse({ type: Object, isArray: false })
  @ApiBadRequestResponse({ description: 'Task not updated' })
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

  /**
   * Delete a task
   */
  @Delete(':taskId')
  @UseGuards(ProjectAdminGuard)
  @ApiOkResponse({ description: 'Task deleted successfuly' })
  @ApiBadRequestResponse({ description: 'Task not deleted' })
  @ApiNotFoundResponse({ description: 'Task not found in this board' })
  async deleteTask(
    @Param('boardId', ParseIntPipe) boardId: number,
    @Param('taskId', ParseIntPipe) taskId: number,
    @CurrentUser() user: JwtPayload['user'],
  ): Promise<void> {
    await this.taskService.deleteTask(boardId, taskId, user);
  }

  /**
   * Move task to new board
   */
  @Patch('move/:taskId')
  @UseGuards(ProjectGuard)
  @ApiOkResponse({
    type: Object,
    isArray: false,
    description: 'Operation to move task to new board was successful',
  })
  @ApiBadRequestResponse({ description: 'Could not move task to new board' })
  async moveTaskToBoard(
    @Param('boardId', ParseIntPipe) boardId: number,
    @Param('taskId', ParseIntPipe) taskId: number,
    @Body() moveTaskDto: MoveTaskDto,
  ): Promise<Task> {
    return await this.taskService.moveTaskToBoard(boardId, taskId, moveTaskDto);
  }
}
