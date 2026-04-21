import { Column, Entity, Index, PrimaryGeneratedColumn } from 'typeorm';
import { BaseAuditEntity } from './base-audit.entity';

@Entity({ name: 'admin_user' })
export class AdminUserEntity extends BaseAuditEntity {
  @PrimaryGeneratedColumn({ name: 'id', type: 'integer' })
  id!: number;

  @Index({ unique: true })
  @Column({ name: 'uid', type: 'varchar', length: 64 })
  uid!: string;

  @Index()
  @Column({ name: 'tenant_id', type: 'varchar', length: 64, nullable: true })
  tenantId!: string | null;

  @Column({ name: 'username', type: 'varchar', length: 64 })
  username!: string;

  @Column({ name: 'password_hash', type: 'varchar', length: 255 })
  passwordHash!: string;

  @Column({ name: 'role_code', type: 'varchar', length: 64 })
  roleCode!: string;

  @Column({ name: 'is_active', type: 'boolean', default: true })
  isActive!: boolean;
}
