import { Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { ThingsService } from '../things/things.service';

@Injectable()
export class NotificationService {
  private readonly logger = new Logger(NotificationService.name);

  constructor(private readonly thingsService: ThingsService) {}

  @Cron(CronExpression.EVERY_HOUR)
  async checkExpiringThings() {
    this.logger.log('检查即将过期的事物...');
    
    try {
      const expiringThings = await this.thingsService.getExpiringThings();
      
      if (expiringThings.length > 0) {
        this.logger.log(`发现 ${expiringThings.length} 个即将过期的事物`);
        
        // 这里可以集成 webhook 或其他通知方式
        for (const thing of expiringThings) {
          this.logger.log(`即将过期: ${thing.name} - ${thing.expireAt}`);
          // TODO: 发送 webhook 通知
        }
      }
    } catch (error) {
      this.logger.error('检查过期事物时出错:', error);
    }
  }

  async sendWebhookNotification(things: any[]) {
    // TODO: 实现 webhook 通知逻辑
    this.logger.log('发送 webhook 通知:', things);
  }
} 