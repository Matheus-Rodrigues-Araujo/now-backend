import { Module } from "@nestjs/common";
import { ProjectController } from "./project.controller";
import { ProjectService } from "./project.service";
import { PrismaService } from "src/prisma/prisma.service";
import { ProjectMemberService } from "./project-member.service";

@Module({
    controllers: [ProjectController],
    providers: [ProjectService, ProjectMemberService, PrismaService]
})
export class ProjectModule {}