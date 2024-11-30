import {
  Body,
  Controller,
  Get,
  Param,
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

@Controller('boards')
@UseGuards(AuthGuard)
export class BoardController {
  constructor(private boardService: BoardService) {}

  @Post()
  async create(@Body() board: CreateBoardDto) {
    return await this.boardService.create(board);
  }

  @Get(':id')
  async findAllBoardTasks(
    @Param('id', ParseIntPipe) id: number,
    @Body() body: { projectId: number },
    @Request() req: AuthenticateRequest,
  ) {
    const { projectId } = body;
    const { sub } = req.user;
    return await this.boardService.findAllBoardTasks(id, projectId, sub);
  }

  @Put(':id')
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() body: { updateBoardDto: UpdateBoardDto; projectId: number },
    @Request() req: AuthenticateRequest,
  ) {
    const { sub } = req.user;
    const { updateBoardDto, projectId } = body;
    return await this.boardService.update(updateBoardDto, id, projectId, sub);
  }

  @Delete(':id')
  async delete(
    @Param('id') id: number,
    @Body() body: { projectId: number },
    @Request() req: AuthenticateRequest,
  ) {
    const { projectId } = body;
    await this.boardService.delete(id, projectId, req.user.sub);
  }
}
