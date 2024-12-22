import { Injectable } from '@nestjs/common';
import { HistoryRepository } from './history.repository';
import { CreateHistoryDto } from './dto';
import { History } from '@prisma/client';
import { Entity_Type } from 'src/history/history.constants';

@Injectable()
export class HistoryService {
  constructor(private historyRepository: HistoryRepository) {}

  async createHistory(
    userId: number,
    entityId: number,
    createHistoryDto: CreateHistoryDto,
  ): Promise<History> {
    return await this.historyRepository.create({
      ...createHistoryDto,
      entityId,
      user: {
        connect: { id: userId },
      },
    });
  }

  async getAllEntityHistory(
    entityId: number,
    entityType: Entity_Type,
  ): Promise<History[]> {
    return await this.historyRepository.findAllById(entityId, entityType);
  }
}
