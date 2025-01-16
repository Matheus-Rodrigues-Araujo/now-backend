import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { FormattedProject } from 'src/common/interfaces';

@Injectable()
export class UserService {
  constructor(private prismaService: PrismaService) {}

  async findProjectsForUser(userId: number) {
    try {
      const project = await this.prismaService.user.findFirst({
        where: {
          id: userId,
          OR: [
            {
              adminProjects: {
                some: {
                  adminId: userId,
                },
              },
              UsersOnProjects: {
                some: {
                  userId: userId,
                },
              },
            },
          ],
        },
        include: {
          adminProjects: true,
          UsersOnProjects: {
            select: {
              project: {
                select: {
                  id: true,
                  title: true,
                  image: true,
                  startDate: true,
                  endDate: true,
                  isActive: true,
                  adminId: true,
                },
              },
            },
          },
        },
      });

      if (!project) throw new UnauthorizedException('Access denied');

      const allProjects = [
        ...project.UsersOnProjects.map((item) => item.project),
        ...project.adminProjects,
      ];

      const formattedProjects: FormattedProject[] = allProjects.map((project) => ({
        id: project.id,
        title: project.title,
        image: project.image,
        startDate: project.startDate,
        endDate: project.endDate,
        isActive: project.isActive,
        isAdmin: project.adminId === userId,
      }));

      return formattedProjects;
    } catch (error) {
      console.error('ERROR: could not find members', error);
      throw new BadRequestException('Faild to fetch project members');
    }
  }
}
