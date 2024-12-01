import {
  Body,
  Controller,
  Get,
  Param,
  Query,
  ParseIntPipe,
  Post,
  Delete,
  Request,
  UseGuards,
  Put,
} from '@nestjs/common';
import { AuthGuard } from 'src/auth/auth.guard';
import { CreateBoardDto, UpdateBoardDto } from './dto';
import { BoardService } from './board.service';
import { AuthenticateRequest } from 'src/types';
import { Board, Task } from '@prisma/client';

@Controller('boards')
@UseGuards(AuthGuard)
export class BoardController {
  constructor(private boardService: BoardService) {}

  @Post()
  async create(@Body() createBoardDto: CreateBoardDto): Promise<Board> {
    return await this.boardService.create(createBoardDto);
  }

  @Get(':id/tasks')
  async findAllBoardTasks(
    @Param('id', ParseIntPipe) id: number,
    @Query('projectId', ParseIntPipe) projectId: number,
    @Request() req: AuthenticateRequest,
  ): Promise<Task[]> {
    const userId = req.user.sub;
    return await this.boardService.findAllBoardTasks(id, projectId, userId);
  }

  @Get(':id')
  async findOne(
    @Param('id', ParseIntPipe) id: number,
    @Query('projectId', ParseIntPipe) projectId: number,
    @Request() req: AuthenticateRequest,
  ): Promise<Board> {
    const userId = req.user.sub;
    return await this.boardService.findOne(id, projectId, userId);
  }

  @Put(':id')
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Query('projectId') projectId: number,
    @Body() updateBoardDto: UpdateBoardDto,
    @Request() req: AuthenticateRequest,
  ): Promise<Board> {
    const userId = req.user.sub;
    
    return await this.boardService.update(
      updateBoardDto,
      id,
      projectId,
      userId,
    );
  }

  @Put('order')
  async updateOrder(@Body() newOrder: { id: number; order: number }[]) {
    return await this.boardService.updateOrder(newOrder);
  }

  @Delete(':id')
  async delete(
    @Param('id') id: number,
    @Query('projectId', ParseIntPipe) projectId: number,
    @Request() req: AuthenticateRequest,
  ): Promise<{ message: string }> {
    const userId = req.user.sub;
    const response = await this.boardService.delete(id, projectId, userId);
    return response;
  }
}
