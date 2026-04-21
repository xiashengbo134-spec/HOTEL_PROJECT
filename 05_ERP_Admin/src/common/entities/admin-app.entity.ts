import { Column, Entity, Index, PrimaryGeneratedColumn } from 'typeorm';
import { BaseAuditEntity } from './base-audit.entity';

@Entity({ name: 'admin_app' })
export class AdminAppEntity extends BaseAuditEntity {
  @PrimaryGeneratedColumn({ name: 'id', type: 'integer' })
  id!: number;

  @Index()
  @Column({ name: 'tenant_id', type: 'varchar', length: 64 })
  tenantId!: string;

  @Index({ unique: true })
  @Column({ name: 'app_code', type: 'varchar', length: 64 })
  appCode!: string;

  @Column({ name: 'app_name', type: 'varchar', length: 128 })
  appName!: string;

  @Column({ name: 'base_url', type: 'varchar', length: 255 })
  baseUrl!: string;

  @Column({ name: 'enabled', type: 'boolean', default: true })
  enabled!: boolean;
}
