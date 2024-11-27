import {
  BadRequestException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class ProjectMemberService {
  constructor(private prismaService: PrismaService) {}

  private async validateUserAccessToProject(projectId: number, userId: number) {
    const userInProject = await this.prismaService.usersOnProjects.findFirst({
      where: { projectId, userId },
    });

    const project = await this.prismaService.project.findUnique({
      where: { id: projectId },
    });

    if (!project) throw new NotFoundException('Project not found');

    const isAdmin = project.adminId === userId;

    if (!isAdmin && !userInProject) {
      throw new UnauthorizedException(
        "You don't have permission to access this project",
      );
    }
  }

  private async validAdmin(projectId: number, userId: number) {
    const project = await this.prismaService.project.findUnique({
      where: { id: projectId },
    });

    if (!project) {
      throw new NotFoundException('Project not found');
    }

    if (project.adminId !== userId)
      throw new UnauthorizedException('Only admins are allowed');
  }

  async addUsersToProject(
    projectId: number,
    adminId: number,
    usersIds: number[],
  ) {
    await this.validAdmin(projectId, adminId);

    if (usersIds.length < 1)
      throw new NotFoundException("You didn't add any user!");

    if (usersIds.indexOf(adminId) !== -1)
      throw new UnauthorizedException(
        'Admin cannot be added as a regular user',
      );

    try {
      await this.prismaService.usersOnProjects.createMany({
        data: usersIds.map((userId) => ({
          userId: userId,
          projectId: projectId,
        })),
        skipDuplicates: true,
      });
      return { message: 'User(s) added to project successfully!' };
    } catch {
      throw new BadRequestException('Error adding users to the project');
    }
  }

  async findProjectMembers(projectId: number, userId: number) {
    await this.validateUserAccessToProject(projectId, userId);

    const members = await this.prismaService.usersOnProjects.findMany({
      where: { projectId },
      include: {
        user: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            role: true,
            image: true,
            isActive: true,
          },
        },
      },
    });

    if (members.length === 0)
      throw new NotFoundException('Project has no members');

    return members.map((user) => user.user);
  }
}
