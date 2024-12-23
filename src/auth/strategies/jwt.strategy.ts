import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { JwtPayload } from 'src/common/interfaces';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private prismaService: PrismaService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: process.env.JWT_SECRET,
    });
  }

  async validate(payload: JwtPayload): Promise<JwtPayload['user'] | null> {
    const { sub, firstName, lastName } = payload.user;
    if (!payload) throw new BadRequestException('Payload not found');
    const user = await this.prismaService.user.findUnique({
      where: { id: sub },
    });

    if (!user) throw new UnauthorizedException('Invalid credentials');

    const userPayload = { sub, firstName, lastName };
    return userPayload;
  }
}
