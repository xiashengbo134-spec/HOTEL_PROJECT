import { Body, Controller, Get, Post } from '@nestjs/common';
import { IsNotEmpty, IsString } from 'class-validator';
import { ApiOperation, ApiProperty, ApiTags } from '@nestjs/swagger';
import { AuthUser } from '../common/auth/auth-user.interface';
import { CurrentUser } from '../common/auth/current-user.decorator';
import { Public } from '../common/auth/public.decorator';
import { AdminAuthService } from './admin-auth.service';

export class LoginDto {
  @ApiProperty({ description: '全局用户UID', example: 'uid_10001' })
  @IsString()
  @IsNotEmpty()
  uid!: string;

  @ApiProperty({ description: '用户密码(示例请求参数)' })
  @IsString()
  @IsNotEmpty()
  password!: string;

}

@ApiTags('Admin_Auth')
@Controller('admin/auth')
export class AdminAuthController {
  constructor(private readonly authService: AdminAuthService) {}

  @Public()
  @ApiOperation({ summary: '管理员登录并签发会话' })
  @Post('login')
  login(@Body() dto: LoginDto) {
    return this.authService.login(dto);
  }

  @ApiOperation({ summary: '获取当前登录用户上下文' })
  @Get('me')
  me(@CurrentUser() user: AuthUser) {
    return user;
  }
}
