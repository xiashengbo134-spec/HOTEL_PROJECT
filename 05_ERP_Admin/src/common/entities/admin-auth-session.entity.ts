import { Column, Entity, Index, PrimaryGeneratedColumn } from 'typeorm';
import { BaseAuditEntity } from './base-audit.entity';

@Entity({ name: 'admin_auth_session' })
export class AdminAuthSessionEntity extends BaseAuditEntity {
  @PrimaryGeneratedColumn({ name: 'id', type: 'integer' })
  id!: number;

  @Index()
  @Column({ name: 'tenant_id', type: 'varchar', length: 64 })
  tenantId!: string;

  @Index()
  @Column({ name: 'uid', type: 'varchar', length: 64 })
  uid!: string;

  @Index({ unique: true })
  @Column({ name: 'access_token', type: 'varchar', length: 255 })
  accessToken!: string;

  @Column({ name: 'expired_at', type: 'datetime' })
  expiredAt!: Date;
}
