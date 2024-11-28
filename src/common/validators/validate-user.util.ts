import { NotFoundException, UnauthorizedException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { UserValidation } from 'src/types';

export async function validateUser(validation: UserValidation) {
  const { prismaService, projectId, userId } = validation;
  const project = await prismaService.usersOnProjects.findFirst({
    where: { userId, projectId },
  });
  if (!project) throw new NotFoundException('Project not found');
  return project;
}
