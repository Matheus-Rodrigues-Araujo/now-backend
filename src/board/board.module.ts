import { Module } from '@nestjs/common';
import { BoardController } from './board.controller';

@Module({
  controllers: [BoardController]
})
export class BoardModule {}
