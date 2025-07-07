import { Module } from '@nestjs/common';
import { NotificationService } from './notification.service';
import { ThingsModule } from '../things/things.module';

@Module({
  imports: [ThingsModule],
  providers: [NotificationService],
})
export class NotificationModule {} 