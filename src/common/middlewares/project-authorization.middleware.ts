import { Injectable, UnauthorizedException } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { PrismaService } from 'src/prisma/prisma.service';
import { AuthenticateRequest } from 'src/types';
import { validateUserOrAdmin } from '../validators';

@Injectable()
export class ProjectAuthorizationMiddleware {
  constructor(private prismaService: PrismaService) {}

  async use(req: Request<any>, res: Response, next: NextFunction) {
    const user = req.user as AuthenticateRequest['user'];
    const projectId = parseInt(req.params.projectId);

    if (!user) throw new UnauthorizedException('Invalid payload');

    await validateUserOrAdmin(this.prismaService, projectId, user.sub);

    next();
  }
}
