import {
  Controller,
  Get,
  Param,
  ParseEnumPipe,
  ParseIntPipe,
  Post,
  Query,
} from '@nestjs/common';
import { HistoryService } from './history.service';
import { CurrentUser } from 'src/common/decorators';
import { JwtPayload } from 'src/types';
import { Entity_Type } from 'src/types';
import { History } from '@prisma/client';

@Controller('history')
export class HistoryController {
  constructor(private readonly historyService: HistoryService) {}

  @Get(':entityId')
  async getAllEntityHistory(
    @Param('entityId', ParseIntPipe) entityId: number,
    @Query('type', ParseEnumPipe) type: Entity_Type,
  ): Promise<History[]> {
    return await this.historyService.getAllEntityHistory(entityId, type);
  }
}
