import { PrismaService } from 'src/prisma/prisma.service';

export interface UserValidation {
  prismaService: PrismaService;
  projectId: number;
  userId: number;
}
