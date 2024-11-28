import { UnauthorizedException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { UserValidation } from 'src/types';

export async function validateAdmin(validation: UserValidation) {
  const { prismaService, projectId, userId } = validation;
  const project = await prismaService.usersOnProjects.findFirst({
    where: { projectId },
    include: {
      project: {
        select: { adminId: true },
      },
    },
  });

  if (!project || project.project.adminId !== userId) {
    throw new UnauthorizedException('Only admins can perform this action');
  }

  return project;
}
