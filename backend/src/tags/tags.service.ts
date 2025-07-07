import { Injectable } from "@nestjs/common";
import { PrismaService } from "../prisma/prisma.service";

@Injectable()
export class TagsService {
  constructor(private prisma: PrismaService) {}

  async findAll() {
    return this.prisma.tag.findMany({
      include: {
        _count: {
          select: {
            things: true,
          },
        },
      },
    });
  }

  async findOne(name: string) {
    return this.prisma.tag.findUnique({
      where: { name },
      include: {
        things: true,
      },
    });
  }

  async searchTags(keyword: string) {
    return this.prisma.tag.findMany({
      where: {
        name: {
          contains: keyword,
          mode: "insensitive", // 不区分大小写
        },
      },
      include: {
        _count: {
          select: {
            things: true,
          },
        },
      },
      orderBy: {
        name: "asc",
      },
    });
  }

  async createTag(name: string) {
    return this.prisma.tag.upsert({
      where: { name },
      update: {}, // 如果存在，不做任何更新
      create: { name }, // 如果不存在，创建新标签
    });
  }
}
