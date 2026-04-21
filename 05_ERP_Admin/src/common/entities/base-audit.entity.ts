import {
  Column,
  CreateDateColumn,
  Index,
  UpdateDateColumn
} from 'typeorm';

export abstract class BaseAuditEntity {
  @CreateDateColumn({ name: 'created_at', type: 'datetime' })
  createdAt!: Date;

  @UpdateDateColumn({ name: 'updated_at', type: 'datetime' })
  updatedAt!: Date;

  @Index()
  @Column({ name: 'operator_id', type: 'varchar', length: 64 })
  operatorId!: string;

  @Index()
  @Column({ name: 'is_deleted', type: 'boolean', default: false })
  isDeleted!: boolean;
}
