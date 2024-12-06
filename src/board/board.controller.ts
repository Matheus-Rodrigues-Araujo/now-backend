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
} from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { CreateBoardDto, UpdateBoardDto } from './dto';
import { BoardService } from './board.service';
import { JwtPayload } from 'src/types';
import { Board, Task } from '@prisma/client';
import { CurrentUser } from 'src/common/decorators';
import { ProjectGuard } from 'src/project/guards/project.guard';

@Controller('boards')
@UseGuards(JwtAuthGuard)
export class BoardController {
  constructor(private boardService: BoardService) {}

  @Post()
  async create(@Body() createBoardDto: CreateBoardDto): Promise<Board> {
    return await this.boardService.create(createBoardDto);
  }

  @Get('project/:projectId')
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

  @Get(':boardId')
  @UseGuards(ProjectGuard)
  async findById(
    @Param('boardId', ParseIntPipe) boardId: number,
    @Param('projectId', ParseIntPipe) projectId: number,
    @CurrentUser() user: JwtPayload['user'],
  ): Promise<Board> {
    return await this.boardService.findById(boardId, projectId);
  }

  @Put(':boardId')
  async update(
    @Param('boardId', ParseIntPipe) boardId: number,
    @Param('projectId') projectId: number,
    @Body() updateBoardDto: UpdateBoardDto,
  ): Promise<Board> {
    return await this.boardService.update(boardId, projectId, updateBoardDto);
  }

  @Put('order')
  async updateOrder(@Body() newOrder: { id: number; order: number }[]) {
    return await this.boardService.updateOrder(newOrder);
  }

  @Delete(':boardId')
  async delete(
    @Param('boardId', ParseIntPipe) boardId: number,
    @Param('projectId', ParseIntPipe) projectId: number,
  ): Promise<void> {
    await this.boardService.delete(boardId, projectId);
  }
}
