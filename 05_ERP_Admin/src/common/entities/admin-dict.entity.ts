import { Column, Entity, Index, PrimaryGeneratedColumn } from 'typeorm';
import { BaseAuditEntity } from './base-audit.entity';

@Entity({ name: 'admin_dict' })
export class AdminDictEntity extends BaseAuditEntity {
  @PrimaryGeneratedColumn({ name: 'id', type: 'integer' })
  id!: number;

  @Index()
  @Column({ name: 'tenant_id', type: 'varchar', length: 64 })
  tenantId!: string;

  @Index()
  @Column({ name: 'dict_type', type: 'varchar', length: 64 })
  dictType!: string;

  @Column({ name: 'dict_key', type: 'varchar', length: 64 })
  dictKey!: string;

  @Column({ name: 'dict_value', type: 'varchar', length: 255 })
  dictValue!: string;

  @Column({ name: 'sort_order', type: 'integer', default: 0 })
  sortOrder!: number;
}
