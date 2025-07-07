import { Module } from "@nestjs/common";
import { RecurringService } from "./recurring.service";
import { PrismaModule } from "../prisma/prisma.module";

@Module({
  imports: [PrismaModule],
  providers: [RecurringService],
  exports: [RecurringService],
})
export class RecurringModule {}
