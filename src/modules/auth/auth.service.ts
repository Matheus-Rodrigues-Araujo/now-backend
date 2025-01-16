import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { User } from '@prisma/client';
import * as argon2 from 'argon2';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from '../prisma/prisma.service';
import { AuthLoginDto, AuthRegisterDto } from './dto';
import { JwtPayload } from 'src/common/interfaces';

@Injectable()
export class AuthService {
  constructor(
    private prismaService: PrismaService,
    private jwtService: JwtService,
  ) {}

  async login(authLogin: AuthLoginDto): Promise<{ access_token: string }> {
    try {
      const { email, hash } = authLogin;

      const userExists = await this.prismaService.user.findUnique({
        where: { email },
      });

      const verifyHash = await argon2.verify(userExists.hash, hash);

      if (!userExists || !verifyHash) {
        throw new UnauthorizedException('Invalid email or password');
      }

      const payload: JwtPayload = {
        user: {
          firstName: userExists.firstName,
          lastName: userExists.lastName || '',
          sub: userExists.id,
        },
      };
      const access_token = await this.jwtService.signAsync(payload);

      return { access_token };
    } catch (error) {
      throw new BadRequestException('Could not sign in');
    }
  }

  async register(authRegister: AuthRegisterDto): Promise<User> {
    try {
      const { email, firstName, lastName, hash } = authRegister;
      const userExists = await this.prismaService.user.findUnique({
        where: { email },
      });

      if (userExists)
        throw new UnauthorizedException(
          'A user account with the provided email or username already exists.',
        );

      const hashedPassword = await argon2.hash(hash);

      return await this.prismaService.user.create({
        data: {
          email: authRegister.email,
          firstName,
          lastName,
          hash: hashedPassword,
        },
      });
    } catch (error) {
      throw new BadRequestException('User not registered');
    }
  }
}
