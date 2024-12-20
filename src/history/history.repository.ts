import { BadRequestException, Injectable } from '@nestjs/common';
import { History, Prisma } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';
import { Entity_Type } from 'src/types';

@Injectable()
export class HistoryRepository {
  constructor(private prismaService: PrismaService) {}

  async create(data: Prisma.HistoryCreateInput): Promise<History> {
    const history = await this.prismaService.history.create({ data });
    if (!history) throw new BadRequestException('History not created');
    return history;
  }

  async findAllById(
    entityId: number,
    entityType: Entity_Type,
  ): Promise<History[]> {
    return await this.prismaService.history.findMany({
      where: { entityId, entityType },
      orderBy: { createdAt: 'desc' },
    });
  }
}
