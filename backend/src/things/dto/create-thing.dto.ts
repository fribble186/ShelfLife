import {
  IsString,
  IsDateString,
  IsBoolean,
  IsOptional,
  IsInt,
  IsArray,
  Min,
} from "class-validator";
import { ApiProperty } from "@nestjs/swagger";

export class CreateThingDto {
  @ApiProperty({ description: "事物名称" })
  @IsString()
  name: string;

  @ApiProperty({ description: "过期时间" })
  @IsDateString()
  expireAt: string;

  @ApiProperty({ description: "是否循环", default: false })
  @IsBoolean()
  @IsOptional()
  isRecurring?: boolean;

  @ApiProperty({ description: "循环间隔（天）", required: false })
  @IsInt()
  @IsOptional()
  recurringInterval?: number;

  @ApiProperty({ description: "距离过期时间多久前提醒（天）" })
  @IsInt()
  notifyBeforeExpiry: number;

  @ApiProperty({ description: "数量", default: 1 })
  @IsInt()
  @Min(1)
  @IsOptional()
  quantity?: number;

  @ApiProperty({ description: "标签列表", type: [String] })
  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  tags?: string[];
}
