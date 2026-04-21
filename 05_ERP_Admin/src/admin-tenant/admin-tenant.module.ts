import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TenantConfigEntity } from '../common/entities/tenant-config.entity';
import { AdminTenantController } from './admin-tenant.controller';
import { AdminTenantService } from './admin-tenant.service';

@Module({
  imports: [TypeOrmModule.forFeature([TenantConfigEntity])],
  controllers: [AdminTenantController],
  providers: [AdminTenantService]
})
export class AdminTenantModule {}
