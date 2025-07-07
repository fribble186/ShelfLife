import { Injectable } from "@nestjs/common";
import { PrismaService } from "../prisma/prisma.service";
import { ThingsService } from "../things/things.service";
import { RecurringService } from "../recurring/recurring.service";

@Injectable()
export class ConsumptionService {
  constructor(
    private prisma: PrismaService,
    private thingsService: ThingsService,
    private recurringService: RecurringService
  ) {}

  async consume(thingId: string, quantity: number = 1) {
    // 获取事物信息
    const thing = await this.thingsService.findOne(thingId);

    if (thing.quantity < quantity) {
      throw new Error("剩余数量不足");
    }

    // 记录消耗
    const consumptionRecord = await this.prisma.consumptionRecord.create({
      data: {
        thingId,
        quantity,
      },
    });

    // 更新剩余数量
    const newQuantity = thing.quantity - quantity;

    await this.prisma.thing.update({
      where: { id: thingId },
      data: { quantity: newQuantity },
    });

    // 如果事物可循环，创建下一个循环
    if (thing.isRecurring && thing.recurringInterval) {
      this.recurringService.handleRecurring(thingId);
    }

    return consumptionRecord;
  }

  async getConsumptionHistory(thingId: string) {
    return this.prisma.consumptionRecord.findMany({
      where: { thingId },
      orderBy: { timestamp: "desc" },
    });
  }
}
