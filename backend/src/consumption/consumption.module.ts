import { Module } from "@nestjs/common";
import { ConsumptionService } from "./consumption.service";
import { ConsumptionController } from "./consumption.controller";
import { ThingsModule } from "../things/things.module";
import { RecurringModule } from "../recurring/recurring.module";
import { PrismaModule } from "../prisma/prisma.module";

@Module({
  imports: [ThingsModule, PrismaModule, RecurringModule],
  controllers: [ConsumptionController],
  providers: [ConsumptionService],
})
export class ConsumptionModule {}
