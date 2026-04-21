import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { AdminDictEntity } from '../common/entities/admin-dict.entity';

@Injectable()
export class AdminDictService {
  constructor(
    @InjectRepository(AdminDictEntity)
    private readonly repo: Repository<AdminDictEntity>
  ) {}

  create(payload: Omit<AdminDictEntity, 'id' | 'createdAt' | 'updatedAt' | 'isDeleted'>) {
    return this.repo.save(this.repo.create({ ...payload, isDeleted: false }));
  }

  findAll() {
    return this.repo.find({ where: { isDeleted: false } });
  }

  async remove(id: number, operatorId: string) {
    const row = await this.repo.findOne({ where: { id, isDeleted: false } });
    if (!row) throw new NotFoundException('字典不存在');
    row.isDeleted = true;
    row.operatorId = operatorId;
    return this.repo.save(row);
  }
}
