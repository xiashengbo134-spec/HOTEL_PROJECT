import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AdminDictEntity } from '../common/entities/admin-dict.entity';
import { AdminDictController } from './admin-dict.controller';
import { AdminDictService } from './admin-dict.service';

@Module({
  imports: [TypeOrmModule.forFeature([AdminDictEntity])],
  controllers: [AdminDictController],
  providers: [AdminDictService]
})
export class AdminDictModule {}
