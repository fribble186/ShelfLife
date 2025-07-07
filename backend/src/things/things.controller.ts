import { Controller, Get, Post, Body, Patch, Param, Delete, Query } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { ThingsService } from './things.service';
import { CreateThingDto } from './dto/create-thing.dto';
import { UpdateThingDto } from './dto/update-thing.dto';

@ApiTags('事物管理')
@Controller('things')
export class ThingsController {
  constructor(private readonly thingsService: ThingsService) {}

  @Post()
  @ApiOperation({ summary: '创建新事物' })
  @ApiResponse({ status: 201, description: '事物创建成功' })
  create(@Body() createThingDto: CreateThingDto) {
    return this.thingsService.create(createThingDto);
  }

  @Get()
  @ApiOperation({ summary: '获取所有事物' })
  @ApiResponse({ status: 200, description: '获取事物列表成功' })
  findAll(@Query('tag') tag?: string) {
    return this.thingsService.findAll(tag);
  }

  @Get('expiring')
  @ApiOperation({ summary: '获取即将过期的事物' })
  @ApiResponse({ status: 200, description: '获取即将过期事物成功' })
  getExpiringThings() {
    return this.thingsService.getExpiringThings();
  }

  @Get(':id')
  @ApiOperation({ summary: '根据 ID 获取事物详情' })
  @ApiResponse({ status: 200, description: '获取事物详情成功' })
  findOne(@Param('id') id: string) {
    return this.thingsService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: '更新事物' })
  @ApiResponse({ status: 200, description: '事物更新成功' })
  update(@Param('id') id: string, @Body() updateThingDto: UpdateThingDto) {
    return this.thingsService.update(id, updateThingDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: '删除事物' })
  @ApiResponse({ status: 200, description: '事物删除成功' })
  remove(@Param('id') id: string) {
    return this.thingsService.remove(id);
  }
} 