import { NotFoundException, UnauthorizedException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';

export async function validateUser(
  prismaService: PrismaService,
  projectId: number,
  userId: number,
): Promise<boolean> {
  const project = await prismaService.usersOnProjects.findFirst({
    where: { projectId, userId },
  });

  if (!project) throw new NotFoundException('Project not found');

  return true;
}
