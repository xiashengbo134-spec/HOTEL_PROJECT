import { Body, Controller, Delete, Get, Param, ParseIntPipe, Post } from '@nestjs/common';
import { IsBoolean, IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { ApiOperation, ApiProperty, ApiTags } from '@nestjs/swagger';
import { AuthUser } from '../common/auth/auth-user.interface';
import { CurrentUser } from '../common/auth/current-user.decorator';
import { AdminUserService } from './admin-user.service';

export class CreateUserDto {
  @ApiProperty({ description: '全局用户UID', example: 'uid_10001' })
  @IsString()
  @IsNotEmpty()
  uid!: string;

  @ApiProperty({ description: '租户ID(全局用户可为空)', required: false, example: 'tenant_10001' })
  @IsOptional()
  @IsString()
  tenantId?: string | null;

  @ApiProperty({ description: '用户名', example: 'admin' })
  @IsString()
  @IsNotEmpty()
  username!: string;

  @ApiProperty({ description: '登录密码(后端自动加密)', example: 'Admin@123456' })
  @IsString()
  @IsNotEmpty()
  password!: string;

  @ApiProperty({ description: '角色编码', example: 'SYSTEM_ADMIN' })
  @IsString()
  @IsNotEmpty()
  roleCode!: string;

  @ApiProperty({ description: '是否启用', example: true })
  @IsBoolean()
  isActive!: boolean;

  @ApiProperty({ description: '最后操作人UID', example: 'sys_admin_001' })
  @IsString()
  @IsNotEmpty()
  operatorId!: string;
}

export class RemoveUserDto {
  @ApiProperty({ description: '最后操作人UID', example: 'sys_admin_001' })
  @IsString()
  @IsNotEmpty()
  operatorId!: string;
}

@ApiTags('Admin_User')
@Controller('admin/users')
export class AdminUserController {
  constructor(private readonly service: AdminUserService) {}

  @ApiOperation({ summary: '创建用户' })
  @Post()
  create(@Body() dto: CreateUserDto) {
    return this.service.create({
      ...dto,
      tenantId: dto.tenantId ?? null
    });
  }

  @ApiOperation({ summary: '查询用户列表' })
  @Get()
  findAll(@CurrentUser() user?: AuthUser) {
    return this.service.findAll(user?.tenantId);
  }

  @ApiOperation({ summary: '软删除用户' })
  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number, @Body() dto: RemoveUserDto) {
    return this.service.remove(id, dto.operatorId);
  }
}
