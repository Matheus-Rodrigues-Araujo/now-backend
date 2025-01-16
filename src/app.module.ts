import { Module } from '@nestjs/common';
import { UserModule } from './modules/user/user.module';
import { ConfigModule } from '@nestjs/config';
import { PrismaModule } from './modules/prisma/prisma.module';
import { AuthModule } from './modules//auth/auth.module';
import { BoardModule } from './modules//board/board.module';
import { TaskModule } from './modules//task/task.module';
import { ProjectModule } from './modules//project/project.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    PrismaModule,
    AuthModule,
    UserModule,
    ProjectModule,
    BoardModule,
    TaskModule,
  ],
})
export class AppModule {}
