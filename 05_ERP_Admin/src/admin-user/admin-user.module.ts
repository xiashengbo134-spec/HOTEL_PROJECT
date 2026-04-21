import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AdminUserEntity } from '../common/entities/admin-user.entity';
import { AdminUserController } from './admin-user.controller';
import { AdminUserService } from './admin-user.service';

@Module({
  imports: [TypeOrmModule.forFeature([AdminUserEntity])],
  controllers: [AdminUserController],
  providers: [AdminUserService]
})
export class AdminUserModule {}
