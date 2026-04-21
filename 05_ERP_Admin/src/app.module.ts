import { Module } from '@nestjs/common';
import { APP_GUARD } from '@nestjs/core';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AdminAppEntity } from './common/entities/admin-app.entity';
import { AdminAuthSessionEntity } from './common/entities/admin-auth-session.entity';
import { AdminDictEntity } from './common/entities/admin-dict.entity';
import { AdminUserEntity } from './common/entities/admin-user.entity';
import { TenantConfigEntity } from './common/entities/tenant-config.entity';
import { JwtAuthGuard } from './common/auth/jwt-auth.guard';
import { AdminAppModule } from './admin-app/admin-app.module';
import { AdminAuthModule } from './admin-auth/admin-auth.module';
import { AdminDictModule } from './admin-dict/admin-dict.module';
import { AdminTenantModule } from './admin-tenant/admin-tenant.module';
import { AdminUserModule } from './admin-user/admin-user.module';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'sqlite',
      database: 'erp_admin.sqlite',
      synchronize: true,
      entities: [
        AdminAppEntity,
        AdminDictEntity,
        AdminUserEntity,
        TenantConfigEntity,
        AdminAuthSessionEntity
      ]
    }),
    AdminAuthModule,
    AdminDictModule,
    AdminAppModule,
    AdminUserModule,
    AdminTenantModule
  ],
  providers: [
    {
      provide: APP_GUARD,
      useClass: JwtAuthGuard
    }
  ]
})
export class AppModule {}
