import { Module } from '@nestjs/common';
import { HistoryService } from './history.service';
import { HistoryRepository } from './history.repository';

@Module({
  providers: [HistoryService, HistoryRepository],
})
export class HistoryModule {}
