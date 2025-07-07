import { Injectable, NotFoundException } from "@nestjs/common";
import { PrismaService } from "../prisma/prisma.service";
import { CreateThingDto } from "./dto/create-thing.dto";
import { UpdateThingDto } from "./dto/update-thing.dto";
import { TagsService } from "../tags/tags.service";

@Injectable()
export class ThingsService {
  constructor(
    private prisma: PrismaService,
    private tagsService: TagsService
  ) {}

  async create(createThingDto: CreateThingDto) {
    const { tags, ...thingData } = createThingDto;

    const tagEntities = await Promise.all(
      tags.map((name) => this.tagsService.createTag(name))
    );
    console.log(tagEntities);

    return this.prisma.thing.create({
      data: {
        ...thingData,
        expireAt: new Date(thingData.expireAt),
        notifyBeforeExpiry: thingData.notifyBeforeExpiry,
        tags: {
          connect: tagEntities.map((tag) => ({ id: tag.id })),
        },
      },
    });
  }

  async findAll(tagFilter?: string) {
    const things = await this.prisma.thing.findMany({
      where: tagFilter
        ? {
            tags: {
              some: {
                name: tagFilter,
              },
            },
          }
        : undefined,
      include: {
        tags: true,
      },
    });

    // 自定义排序逻辑
    return things.sort((a, b) => {
      // 首先按 quantity 排序：quantity 为 0 的排在最底下
      if (a.quantity === 0 && b.quantity !== 0) return 1;
      if (a.quantity !== 0 && b.quantity === 0) return -1;

      // 然后按 expireAt 排序：即将过期的排在前面
      return new Date(a.expireAt).getTime() - new Date(b.expireAt).getTime();
    });
  }

  async findOne(id: string) {
    const thing = await this.prisma.thing.findUnique({
      where: { id },
      include: {
        tags: true,
        consumptionRecords: {
          orderBy: {
            timestamp: "desc",
          },
        },
      },
    });

    if (!thing) {
      throw new NotFoundException(`事物 ID ${id} 不存在`);
    }

    return thing;
  }

  async update(id: string, updateThingDto: UpdateThingDto) {
    const { tags, ...thingData } = updateThingDto;

    const tagEntities = await Promise.all(
      tags.map((name) => this.tagsService.createTag(name))
    );

    // 检查事物是否存在
    await this.findOne(id);

    return this.prisma.thing.update({
      where: { id },
      data: {
        ...thingData,
        expireAt: thingData.expireAt ? new Date(thingData.expireAt) : undefined,
        notifyBeforeExpiry: thingData.notifyBeforeExpiry
          ? thingData.notifyBeforeExpiry
          : undefined,
        tags: {
          set: tagEntities.map((tag) => ({ id: tag.id })),
        },
      },
    });
  }

  async remove(id: string) {
    // 检查事物是否存在
    await this.findOne(id);

    return this.prisma.thing.delete({
      where: { id },
    });
  }

  async getExpiringThings() {
    const now = new Date();

    return this.prisma.thing.findMany({
      where: {
        expireAt: {
          lte: new Date(now.getTime() + 24 * 60 * 60 * 1000), // 1天内过期
        },
        quantity: {
          gt: 0, // 只查询数量大于0的事物
        },
      },
      include: {
        tags: true,
      },
    });
  }
}
