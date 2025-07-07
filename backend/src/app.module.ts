import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ScheduleModule } from '@nestjs/schedule';
import { PrismaModule } from './prisma/prisma.module';
import { ThingsModule } from './things/things.module';
import { TagsModule } from './tags/tags.module';
import { ConsumptionModule } from './consumption/consumption.module';
import { NotificationModule } from './notification/notification.module';
import { RecurringModule } from './recurring/recurring.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    ScheduleModule.forRoot(),
    PrismaModule,
    ThingsModule,
    TagsModule,
    ConsumptionModule,
    NotificationModule,
    RecurringModule,
  ],
})
export class AppModule {} 