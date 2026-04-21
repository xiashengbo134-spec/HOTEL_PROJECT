import { Body, Controller, Delete, Get, Param, ParseIntPipe, Post } from '@nestjs/common';
import { IsInt, IsNotEmpty, IsString } from 'class-validator';
import { ApiOperation, ApiProperty, ApiTags } from '@nestjs/swagger';
import { AdminDictService } from './admin-dict.service';

export class CreateDictDto {
  @ApiProperty({ description: '租户ID', example: 'tenant_10001' })
  @IsString()
  @IsNotEmpty()
  tenantId!: string;

  @ApiProperty({ description: '字典类型', example: 'order_status' })
  @IsString()
  @IsNotEmpty()
  dictType!: string;

  @ApiProperty({ description: '字典键', example: 'Pending_Pay' })
  @IsString()
  @IsNotEmpty()
  dictKey!: string;

  @ApiProperty({ description: '字典值', example: '待支付' })
  @IsString()
  @IsNotEmpty()
  dictValue!: string;

  @ApiProperty({ description: '排序值', example: 10 })
  @IsInt()
  sortOrder!: number;

  @ApiProperty({ description: '最后操作人UID', example: 'sys_admin_001' })
  @IsString()
  @IsNotEmpty()
  operatorId!: string;
}

export class RemoveDictDto {
  @ApiProperty({ description: '最后操作人UID', example: 'sys_admin_001' })
  @IsString()
  @IsNotEmpty()
  operatorId!: string;
}

@ApiTags('Admin_Dict')
@Controller('admin/dicts')
export class AdminDictController {
  constructor(private readonly service: AdminDictService) {}

  @ApiOperation({ summary: '创建字典项' })
  @Post()
  create(@Body() dto: CreateDictDto) {
    return this.service.create(dto);
  }

  @ApiOperation({ summary: '查询字典列表' })
  @Get()
  findAll() {
    return this.service.findAll();
  }

  @ApiOperation({ summary: '软删除字典项' })
  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number, @Body() dto: RemoveDictDto) {
    return this.service.remove(id, dto.operatorId);
  }
}
