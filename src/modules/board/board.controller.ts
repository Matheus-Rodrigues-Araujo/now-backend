import {
  Body,
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Delete,
  UseGuards,
  Put,
  Patch,
} from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CreateBoardDto, UpdateBoardDto, UpdateBoardOrder } from './dto';
import { BoardService } from './board.service';
import { JwtPayload } from 'src/common/interfaces';
import { Board, Task } from '@prisma/client';
import { CurrentUser } from 'src/common/decorators';
import { ProjectGuard } from '../project/guards/project.guard';
import { ProjectAdminGuard } from '../project/guards/project-admin.guard';
import {
  ApiBadRequestResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiTags,
} from '@nestjs/swagger';

@ApiTags('Board')
@Controller('projects/:projectId/boards')
@UseGuards(JwtAuthGuard)
export class BoardController {
  constructor(private boardService: BoardService) {}

  /**
   * Create new board
   */
  @ApiOkResponse({
    type: Object,
    description: 'Created Successfully',
  })
  @ApiBadRequestResponse({ description: 'Failed to create the board' })
  @Post()
  async create(@Body() createBoardDto: CreateBoardDto): Promise<Board> {
    return await this.boardService.createBoard(createBoardDto);
  }

  /**
   * Find all boards from project
   */
  @Get()
  @ApiOkResponse({
    type: Object,
    isArray: true,
  })
  @ApiBadRequestResponse({ description: 'Project has no boards' })
  @UseGuards(ProjectGuard)
  async findBoardsFromProject(
    @Param('projectId', ParseIntPipe) projectId: number,
  ): Promise<Board[]> {
    return await this.boardService.findBoardsFromProject(projectId);
  }

  /**
   * Get all tasks on a board
   */
  @Get(':boardId/tasks')
  @UseGuards(ProjectGuard)
  @ApiOkResponse({ type: Object, isArray: true })
  @ApiNotFoundResponse({ description: "Board don't have any task" })
  async findAllBoardTasks(
    @Param('boardId', ParseIntPipe) boardId: number,
    @Param('projectId', ParseIntPipe) projectId: number,
  ): Promise<Task[]> {
    return await this.boardService.findAllBoardTasks(boardId, projectId);
  }

  /**
   * Get boards with tasks
   */
  @Get('boards-with-tasks')
  @UseGuards(ProjectGuard)
  @ApiOkResponse({
    type: Object,
    isArray: true,
  })
  @ApiNotFoundResponse({ description: 'No boards and tasks created' })
  @ApiBadRequestResponse()
  async findBoardsAndTasks(
    @Param('projectId', ParseIntPipe) projectId: number,
  ) {
    return await this.boardService.findBoardsWithTasks(projectId);
  }

  /**
   * Get board by Id
   */
  @Get(':boardId')
  @UseGuards(ProjectGuard)
  @ApiOkResponse({ type: Object })
  @ApiNotFoundResponse({ description: 'Board not found' })
  async findById(
    @Param('boardId', ParseIntPipe) boardId: number,
    @Param('projectId', ParseIntPipe) projectId: number,
    @CurrentUser() user: JwtPayload['user'],
  ): Promise<Board> {
    return await this.boardService.findBoardById(boardId, projectId);
  }

  /**
   * Update board
   */
  @Put(':boardId')
  @UseGuards(ProjectAdminGuard)
  @ApiOkResponse({ type: Object, description: 'Board updated' })
  @ApiBadRequestResponse({ description: 'Board not updated' })
  async update(
    @Param('boardId', ParseIntPipe) boardId: number,
    @Param('projectId', ParseIntPipe) projectId: number,
    @Body() updateBoardDto: UpdateBoardDto,
  ): Promise<Board> {
    return await this.boardService.updateBoard(
      boardId,
      projectId,
      updateBoardDto,
    );
  }

  /**
   * Update order from boards
   */
  @Patch('order')
  @UseGuards(ProjectAdminGuard)
  @ApiOkResponse({
    type: Object,
    isArray: true,
    description: 'Board(s) order updated',
  })
  @ApiBadRequestResponse({ description: 'Board not updated' })
  async updateBoardsOrder(
    @Param('projectId', ParseIntPipe) projectId: number,
    @Body() boards: UpdateBoardOrder[],
  ): Promise<Board[]> {
    return await this.boardService.updateBoardsOrder(projectId, boards);
  }

  /**
   * Delete a board and its related data
   */
  @Delete(':boardId')
  @ApiOkResponse({ description: 'Board deleted successfully' })
  @ApiBadRequestResponse({ description: 'Board not deleted' })
  @ApiNotFoundResponse({ description: 'Board not found' })
  async delete(
    @Param('boardId', ParseIntPipe) boardId: number,
    @Param('projectId', ParseIntPipe) projectId: number,
  ): Promise<void> {
    await this.boardService.deleteBoard(boardId, projectId);
  }
}
