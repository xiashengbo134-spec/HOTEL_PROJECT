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
import { IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { ApiOperation, ApiProperty, ApiTags } from '@nestjs/swagger';
import { CurrentUser } from '../common/auth/current-user.decorator';
import { AuthUser } from '../common/auth/auth-user.interface';
import { AdminTenantService } from './admin-tenant.service';

export class CreateTenantDto {
  @ApiProperty({ description: '租户唯一标识', example: 'tenant_10001' })
  @IsString()
  @IsNotEmpty()
  tenantId!: string;

  @ApiProperty({
    description: '应用权限掩码(BigInt字符串，非金额字段)',
    example: '1099511627776'
  })
  @IsString()
  @IsNotEmpty()
  appPermissionMask!: string;

  @ApiProperty({ description: '租户名称', example: '畅行科技租户A' })
  @IsString()
  @IsNotEmpty()
  tenantName!: string;

  @ApiProperty({ description: '租户状态', example: 'active' })
  @IsString()
  @IsNotEmpty()
  status!: string;

  @ApiProperty({
    description: '扩展配置JSON字符串',
    required: false,
    example: '{"region":"CN"}'
  })
  @IsOptional()
  @IsString()
  extJson?: string | null;

  @ApiProperty({ description: '最后操作人UID', example: 'sys_admin_001' })
  @IsString()
  @IsNotEmpty()
  operatorId!: string;
}

export class RemoveTenantDto {
  @ApiProperty({ description: '最后操作人UID', example: 'sys_admin_001' })
  @IsString()
  @IsNotEmpty()
  operatorId!: string;
}

@ApiTags('Admin_Tenant')
@Controller('admin/tenants')
export class AdminTenantController {
  constructor(private readonly service: AdminTenantService) {}

  @ApiOperation({ summary: '创建租户配置' })
  @Post()
  create(@Body() dto: CreateTenantDto) {
    return this.service.create({ ...dto, extJson: dto.extJson ?? null });
  }

  @ApiOperation({ summary: '查询租户配置列表' })
  @Get()
  findAll(@CurrentUser() user?: AuthUser) {
    return this.service.findAll(user?.tenantId);
  }

  @ApiOperation({ summary: '更新租户配置' })
  @Put(':id')
  update(@Param('id', ParseIntPipe) id: number, @Body() dto: CreateTenantDto) {
    return this.service.update(id, { ...dto, extJson: dto.extJson ?? null });
  }

  @ApiOperation({ summary: '软删除租户配置' })
  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number, @Body() dto: RemoveTenantDto) {
    return this.service.remove(id, dto.operatorId);
  }
}
