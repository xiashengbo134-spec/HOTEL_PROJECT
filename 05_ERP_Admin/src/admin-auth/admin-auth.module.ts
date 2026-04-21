import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AdminAuthSessionEntity } from '../common/entities/admin-auth-session.entity';
import { AdminUserEntity } from '../common/entities/admin-user.entity';
import { JwtStrategy } from '../common/auth/jwt.strategy';
import { AdminAuthController } from './admin-auth.controller';
import { AdminAuthService } from './admin-auth.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([AdminUserEntity, AdminAuthSessionEntity]),
    PassportModule,
    JwtModule.register({
      secret: process.env.JWT_SECRET ?? 'erp_admin_jwt_secret',
      signOptions: { expiresIn: '2h' }
    })
  ],
  controllers: [AdminAuthController],
  providers: [AdminAuthService, JwtStrategy],
  exports: [JwtModule]
})
export class AdminAuthModule {}
