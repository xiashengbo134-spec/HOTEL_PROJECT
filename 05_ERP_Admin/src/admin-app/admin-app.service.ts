import {
  ConflictException,
  Injectable,
  NotFoundException
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { AdminAppEntity } from '../common/entities/admin-app.entity';

@Injectable()
export class AdminAppService {
  constructor(
    @InjectRepository(AdminAppEntity)
    private readonly repo: Repository<AdminAppEntity>
  ) {}

  async create(
    payload: Omit<AdminAppEntity, 'id' | 'createdAt' | 'updatedAt' | 'isDeleted'>
  ) {
    const existing = await this.repo.findOne({
      where: { appCode: payload.appCode, isDeleted: false }
    });
    if (existing) throw new ConflictException('app_code 已存在');
    return this.repo.save(this.repo.create({ ...payload, isDeleted: false }));
  }

  findAll() {
    return this.repo.find({ where: { isDeleted: false } });
  }

  async update(
    id: number,
    payload: Omit<AdminAppEntity, 'id' | 'createdAt' | 'updatedAt' | 'isDeleted'>
  ) {
    const app = await this.repo.findOne({ where: { id, isDeleted: false } });
    if (!app) throw new NotFoundException('应用不存在');

    if (app.appCode !== payload.appCode) {
      const duplicate = await this.repo.findOne({
        where: { appCode: payload.appCode, isDeleted: false }
      });
      if (duplicate) throw new ConflictException('app_code 已存在');
    }

    app.tenantId = payload.tenantId;
    app.appCode = payload.appCode;
    app.appName = payload.appName;
    app.baseUrl = payload.baseUrl;
    app.enabled = payload.enabled;
    app.operatorId = payload.operatorId;
    return this.repo.save(app);
  }

  async remove(id: number, operatorId: string) {
    const app = await this.repo.findOne({ where: { id, isDeleted: false } });
    if (!app) throw new NotFoundException('应用不存在');
    app.isDeleted = true;
    app.operatorId = operatorId;
    return this.repo.save(app);
  }
}
