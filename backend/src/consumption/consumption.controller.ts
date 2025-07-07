import { Controller, Post, Param, Body, Get } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { ConsumptionService } from './consumption.service';

@ApiTags('消耗管理')
@Controller('consumption')
export class ConsumptionController {
  constructor(private readonly consumptionService: ConsumptionService) {}

  @Post(':thingId')
  @ApiOperation({ summary: '消耗事物' })
  @ApiResponse({ status: 201, description: '消耗记录创建成功' })
  consume(
    @Param('thingId') thingId: string,
    @Body('quantity') quantity: number = 1,
  ) {
    return this.consumptionService.consume(thingId, quantity);
  }

  @Get(':thingId/history')
  @ApiOperation({ summary: '获取消耗历史' })
  @ApiResponse({ status: 200, description: '获取消耗历史成功' })
  getHistory(@Param('thingId') thingId: string) {
    return this.consumptionService.getConsumptionHistory(thingId);
  }
} 