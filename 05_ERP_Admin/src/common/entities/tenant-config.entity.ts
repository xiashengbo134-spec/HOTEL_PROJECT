import { Column, Entity, Index, PrimaryGeneratedColumn } from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { BaseAuditEntity } from './base-audit.entity';

@Entity({ name: 'tenant_config' })
export class TenantConfigEntity extends BaseAuditEntity {
  @ApiProperty({ description: '主键ID', example: 1 })
  @PrimaryGeneratedColumn({ name: 'id', type: 'integer' })
  id!: number;

  // 03文档要求：tenant_id为租户配置唯一标识，且必须可索引
  @ApiProperty({ description: '租户唯一标识', example: 'tenant_10001' })
  @Index({ unique: true })
  @Column({ name: 'tenant_id', type: 'varchar', length: 64 })
  tenantId!: string;

  // 使用字符串承载BigInt，避免JS number精度风险
  @ApiProperty({
    description: '应用权限掩码(BigInt字符串)',
    example: '1099511627776'
  })
  @Column({ name: 'app_permission_mask', type: 'bigint' })
  appPermissionMask!: string;

  @ApiProperty({ description: '租户名称', example: '畅行科技租户A' })
  @Column({ name: 'tenant_name', type: 'varchar', length: 128 })
  tenantName!: string;

  @ApiProperty({ description: '租户状态', example: 'active' })
  @Column({ name: 'status', type: 'varchar', length: 32, default: 'active' })
  status!: string;

  @ApiProperty({
    description: '扩展配置JSON字符串',
    required: false,
    example: '{"region":"CN"}'
  })
  @Column({ name: 'ext_json', type: 'text', nullable: true })
  extJson!: string | null;
}
