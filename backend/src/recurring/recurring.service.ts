import { Injectable } from "@nestjs/common";
import { PrismaService } from "src/prisma/prisma.service";

@Injectable()
export class RecurringService {
  constructor(private prisma: PrismaService) {}
  async handleRecurring(thingId: string) {
    const thing = await this.prisma.thing.findUnique({
      where: { id: thingId },
    });
    if (!thing) {
      throw new Error("Thing not found");
    }
    if (!thing.isRecurring) {
      throw new Error("Thing is not recurring");
    }
    if (!thing.recurringInterval) {
      throw new Error("Recurring interval is not set");
    }

    // 将天数转换为毫秒
    const recurringIntervalMs = thing.recurringInterval * 24 * 60 * 60 * 1000;
    const nextExpireAt = new Date(
      thing.expireAt.getTime() + recurringIntervalMs
    );

    // notifyBeforeExpiry 保持为天数，不需要转换
    return this.prisma.thing.update({
      where: { id: thingId },
      data: {
        expireAt: nextExpireAt,
        quantity: 1,
      },
    });
  }
}
