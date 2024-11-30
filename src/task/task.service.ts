import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class TaskService {
  constructor(private prismaService: PrismaService) {}

  async findOne(id: number, projectId: number, userId: number) {
    const userInProject = await this.prismaService.usersOnProjects.findFirst({
      where: {
        projectId: projectId,
        userId: userId,
      },
      include: {
        project: {
          select: {
            tasks: {
              select: {
                id: true,
              },
            },
          },
        },
      },
    });

    if (!userInProject) throw new UnauthorizedException('Access denied');
    if (userInProject.project.tasks.some((task) => task.id !== id))
      throw new NotFoundException('Task not in the project');

    const task = await this.prismaService.task.findUnique({ where: { id } });
    if (!task) throw new NotFoundException('Task not found');

    return task;
  }
}
