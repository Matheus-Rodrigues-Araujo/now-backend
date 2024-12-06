import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { ProjectRepository } from '../project.repository';

@Injectable()
export class ProjectAdminGuard implements CanActivate {
  constructor(private readonly projectRepository: ProjectRepository) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const userId = request.user.sub;
    const projectId = parseInt(request.params.id);

    if (!userId || !projectId) return false;

    return await this.projectRepository.validateProjectAdmin(projectId, userId);
  }
}
