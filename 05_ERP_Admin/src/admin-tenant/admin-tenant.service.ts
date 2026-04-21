import {
  ConflictException,
  Injectable,
  NotFoundException
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { TenantConfigEntity } from '../common/entities/tenant-config.entity';

@Injectable()
export class AdminTenantService {
  constructor(
    @InjectRepository(TenantConfigEntity)
    private readonly repo: Repository<TenantConfigEntity>
  ) {}

  async create(
    payload: Omit<TenantConfigEntity, 'id' | 'createdAt' | 'updatedAt' | 'isDeleted'>
  ) {
    const existing = await this.repo.findOne({
      where: { tenantId: payload.tenantId, isDeleted: false }
    });
    if (existing) throw new ConflictException('tenant_id 已存在');
    return this.repo.save(this.repo.create({ ...payload, isDeleted: false }));
  }

  findAll(tenantId?: string | null) {
    if (tenantId) {
      return this.repo.find({ where: { isDeleted: false, tenantId } });
    }
    return this.repo.find({ where: { isDeleted: false } });
  }

  async update(
    id: number,
    payload: Omit<TenantConfigEntity, 'id' | 'createdAt' | 'updatedAt' | 'isDeleted'>
  ) {
    const row = await this.repo.findOne({ where: { id, isDeleted: false } });
    if (!row) throw new NotFoundException('租户配置不存在');

    if (payload.tenantId !== row.tenantId) {
      const duplicate = await this.repo.findOne({
        where: { tenantId: payload.tenantId, isDeleted: false }
      });
      if (duplicate) throw new ConflictException('tenant_id 已存在');
    }

    row.tenantId = payload.tenantId;
    row.appPermissionMask = payload.appPermissionMask;
    row.tenantName = payload.tenantName;
    row.status = payload.status;
    row.extJson = payload.extJson ?? null;
    row.operatorId = payload.operatorId;

    return this.repo.save(row);
  }

  async remove(id: number, operatorId: string) {
    const row = await this.repo.findOne({ where: { id, isDeleted: false } });
    if (!row) throw new NotFoundException('租户配置不存在');
    row.isDeleted = true;
    row.operatorId = operatorId;
    return this.repo.save(row);
  }
}
