import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { JwtPayload } from 'src/types';
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

  async validate(payload: JwtPayload): Promise<JwtPayload | null> {
    const { sub, firstName, lastName } = payload['user'];
    const user = await this.prismaService.user.findUnique({
      where: { id: sub },
    });

    if (!user) throw new UnauthorizedException('Invalid credentials');

    const userPayload = { user: { sub, firstName, lastName } };
    return userPayload;
  }
}
