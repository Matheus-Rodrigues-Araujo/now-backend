import { UnauthorizedException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';

export async function validateAdmin(
  prismaService: PrismaService,
  projectId: number,
  userId: number,
): Promise<boolean> {
  const project = await prismaService.project.findUnique({
    where: { id: projectId },
  });

  if (!project) {
    throw new UnauthorizedException('Project not found');
  }

  if (project.adminId !== userId) {
    throw new UnauthorizedException('Only admins can perform this action');
  }

  return project.adminId === userId;
}
