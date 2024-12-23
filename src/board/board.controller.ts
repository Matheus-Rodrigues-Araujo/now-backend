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
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { CreateBoardDto, UpdateBoardDto, UpdateBoardOrder } from './dto';
import { BoardService } from './board.service';
import { JwtPayload } from 'src/common/interfaces';
import { Board, Task } from '@prisma/client';
import { CurrentUser } from 'src/common/decorators';
import { ProjectGuard } from 'src/project/guards/project.guard';
import { ProjectAdminGuard } from 'src/project/guards/project-admin.guard';

@Controller('projects/:projectId/boards')
@UseGuards(JwtAuthGuard)
export class BoardController {
  constructor(private boardService: BoardService) {}

  @Post()
  async create(@Body() createBoardDto: CreateBoardDto): Promise<Board> {
    return await this.boardService.createBoard(createBoardDto);
  }

  @Get()
  @UseGuards(ProjectGuard)
  async findBoardsFromProject(
    @Param('projectId', ParseIntPipe) projectId: number,
  ): Promise<Board[]> {
    return await this.boardService.findBoardsFromProject(projectId);
  }

  @Get(':boardId/tasks')
  @UseGuards(ProjectGuard)
  async findAllBoardTasks(
    @Param('boardId', ParseIntPipe) boardId: number,
    @Param('projectId', ParseIntPipe) projectId: number,
  ): Promise<Task[]> {
    return await this.boardService.findAllBoardTasks(boardId, projectId);
  }

  @Get('boards-with-tasks')
  @UseGuards(ProjectGuard)
  async findBoardsAndTasks(
    @Param('projectId', ParseIntPipe) projectId: number,
  ) {
    return await this.boardService.findBoardsWithTasks(projectId);
  }

  @Get(':boardId')
  @UseGuards(ProjectGuard)
  async findById(
    @Param('boardId', ParseIntPipe) boardId: number,
    @Param('projectId', ParseIntPipe) projectId: number,
    @CurrentUser() user: JwtPayload['user'],
  ): Promise<Board> {
    return await this.boardService.findBoardById(boardId, projectId);
  }

  @Put(':boardId')
  @UseGuards(ProjectAdminGuard)
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

  @Patch('order')
  @UseGuards(ProjectAdminGuard)
  async updateBoardsOrder(
    @Param('projectId', ParseIntPipe) projectId: number,
    @Body() boards: UpdateBoardOrder[],
  ) {
    return await this.boardService.updateBoardsOrder(projectId, boards);
  }

  @Delete(':boardId')
  async delete(
    @Param('boardId', ParseIntPipe) boardId: number,
    @Param('projectId', ParseIntPipe) projectId: number,
  ): Promise<void> {
    await this.boardService.deleteBoard(boardId, projectId);
  }
}
