import { Controller, Get, Param, Query } from "@nestjs/common";
import { ApiTags, ApiOperation, ApiResponse, ApiQuery } from "@nestjs/swagger";
import { TagsService } from "./tags.service";

@ApiTags("标签管理")
@Controller("tags")
export class TagsController {
  constructor(private readonly tagsService: TagsService) {}

  @Get()
  @ApiOperation({ summary: "获取所有标签" })
  @ApiResponse({ status: 200, description: "获取标签列表成功" })
  findAll() {
    return this.tagsService.findAll();
  }

  @Get("search")
  @ApiOperation({ summary: "模糊搜索标签" })
  @ApiQuery({ name: "keyword", description: "搜索关键词", required: true })
  @ApiResponse({ status: 200, description: "搜索标签成功" })
  searchTags(@Query("keyword") keyword: string) {
    return this.tagsService.searchTags(keyword);
  }

  // @Get(":name")
  // @ApiOperation({ summary: "根据名称获取标签详情" })
  // @ApiResponse({ status: 200, description: "获取标签详情成功" })
  // findOne(@Param("name") name: string) {
  //   return this.tagsService.findOne(name);
  // }
}
