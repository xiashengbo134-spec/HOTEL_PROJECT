import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AdminAppEntity } from '../common/entities/admin-app.entity';
import { AdminAppController } from './admin-app.controller';
import { AdminAppService } from './admin-app.service';

@Module({
  imports: [TypeOrmModule.forFeature([AdminAppEntity])],
  controllers: [AdminAppController],
  providers: [AdminAppService]
})
export class AdminAppModule {}
