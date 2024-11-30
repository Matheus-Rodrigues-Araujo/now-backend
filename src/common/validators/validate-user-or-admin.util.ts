import { UnauthorizedException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';

export async function validateUserOrAdmin(
  prismaService: PrismaService,
  projectId: number,
  userId: number,
): Promise<boolean> {
  const userOnProject = await prismaService.usersOnProjects.findFirst({
    where: { projectId, userId },
  });

  const project = await prismaService.project.findUnique({
    where: { id: projectId },
  });

  if (!userOnProject && project.adminId !== userId)
    throw new UnauthorizedException('Access denied');

  return true;
}
