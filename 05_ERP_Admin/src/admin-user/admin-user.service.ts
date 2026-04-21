import { Injectable, NotFoundException, OnModuleInit } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import * as bcrypt from 'bcrypt';
import { Repository } from 'typeorm';
import { AdminUserEntity } from '../common/entities/admin-user.entity';

@Injectable()
export class AdminUserService implements OnModuleInit {
  constructor(
    @InjectRepository(AdminUserEntity)
    private readonly repo: Repository<AdminUserEntity>
  ) {}

  async onModuleInit(): Promise<void> {
    const root = await this.repo.findOne({
      where: { uid: 'root_admin', isDeleted: false }
    });
    if (root) return;

    const passwordHash = await bcrypt.hash('Admin@123456', 10);
    await this.repo.save(
      this.repo.create({
        uid: 'root_admin',
        tenantId: null,
        username: 'Root Admin',
        passwordHash,
        roleCode: 'SYSTEM_ADMIN',
        isActive: true,
        operatorId: 'bootstrap',
        isDeleted: false
      })
    );
  }

  async create(
    payload: Omit<
      AdminUserEntity,
      'id' | 'createdAt' | 'updatedAt' | 'isDeleted' | 'passwordHash'
    > & { password: string }
  ) {
    const passwordHash = await bcrypt.hash(payload.password, 10);
    const { password, ...rest } = payload;
    void password;
    return this.repo.save(
      this.repo.create({ ...rest, passwordHash, isDeleted: false })
    );
  }

  findAll(tenantId?: string | null) {
    if (tenantId) {
      return this.repo.find({ where: { isDeleted: false, tenantId } });
    }
    return this.repo.find({ where: { isDeleted: false } });
  }

  async remove(id: number, operatorId: string) {
    const row = await this.repo.findOne({ where: { id, isDeleted: false } });
    if (!row) throw new NotFoundException('用户不存在');
    row.isDeleted = true;
    row.operatorId = operatorId;
    return this.repo.save(row);
  }
}
