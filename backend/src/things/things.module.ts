import { Module } from "@nestjs/common";
import { ThingsService } from "./things.service";
import { ThingsController } from "./things.controller";
import { PrismaModule } from "../prisma/prisma.module";
import { TagsModule } from "../tags/tags.module";

@Module({
  imports: [PrismaModule, TagsModule],
  controllers: [ThingsController],
  providers: [ThingsService],
  exports: [ThingsService],
})
export class ThingsModule {}
