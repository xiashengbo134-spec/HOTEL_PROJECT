import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Put
} from '@nestjs/common';
import { IsBoolean, IsNotEmpty, IsString } from 'class-validator';
import { ApiOperation, ApiProperty, ApiTags } from '@nestjs/swagger';
import { AdminAppService } from './admin-app.service';

export class CreateAppDto {
  @ApiProperty({ description: '租户ID', example: 'tenant_10001' })
  @IsString()
  @IsNotEmpty()
  tenantId!: string;

  @ApiProperty({ description: '应用编码', example: 'ERP_MANAGER' })
  @IsString()
  @IsNotEmpty()
  appCode!: string;

  @ApiProperty({ description: '应用名称', example: 'ERP 管理后台' })
  @IsString()
  @IsNotEmpty()
  appName!: string;

  @ApiProperty({ description: '应用入口地址', example: '/erp-manager' })
  @IsString()
  @IsNotEmpty()
  baseUrl!: string;

  @ApiProperty({ description: '是否启用', example: true })
  @IsBoolean()
  enabled!: boolean;

  @ApiProperty({ description: '最后操作人UID', example: 'sys_admin_001' })
  @IsString()
  @IsNotEmpty()
  operatorId!: string;
}

export class RemoveAppDto {
  @ApiProperty({ description: '最后操作人UID', example: 'sys_admin_001' })
  @IsString()
  @IsNotEmpty()
  operatorId!: string;
}

@ApiTags('Admin_App')
@Controller('admin/apps')
export class AdminAppController {
  constructor(private readonly service: AdminAppService) {}

  @ApiOperation({ summary: '创建应用' })
  @Post()
  create(@Body() dto: CreateAppDto) {
    return this.service.create(dto);
  }

  @ApiOperation({ summary: '查询应用列表' })
  @Get()
  findAll() {
    return this.service.findAll();
  }

  @ApiOperation({ summary: '更新应用' })
  @Put(':id')
  update(@Param('id', ParseIntPipe) id: number, @Body() dto: CreateAppDto) {
    return this.service.update(id, dto);
  }

  @ApiOperation({ summary: '软删除应用' })
  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number, @Body() dto: RemoveAppDto) {
    return this.service.remove(id, dto.operatorId);
  }
}
