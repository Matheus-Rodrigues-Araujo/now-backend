import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { validateUserOrAdmin } from 'src/common/validators';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class ProjectGuard implements CanActivate {
  constructor(private prismaService: PrismaService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const userId = request.user.sub;
    const projectId = parseInt(request.params.id);

    if (!userId || !projectId) return false;
    
    return await validateUserOrAdmin(this.prismaService, projectId, userId);
  }
}
