export interface Tenant {
  id: number;
  tenantId: string;
  appPermissionMask: string;
  tenantName: string;
  status: string;
  extJson: string | null;
  operatorId: string;
  createdAt: string;
  updatedAt: string;
  isDeleted: boolean;
}

export interface TenantFormValues {
  tenantId: string;
  appPermissionMask: string;
  selectedAppIds?: number[];
  tenantName: string;
  status: string;
  extJson?: string;
  operatorId: string;
}
