export type TenantStatus = 'active' | 'disabled' | 'initializing' | 'exception'

export interface Tenant {
  id: number
  tenantId: string
  appPermissionMask: string
  tenantName: string
  status: TenantStatus
  extJson: string | null
  operatorId: string
  createdAt: string
  updatedAt: string
  isDeleted: boolean
  shortName?: string
  contactName?: string
  contactMobile?: string
  contactEmail?: string
  remark?: string
  initStatus?: 'completed' | 'pending' | 'exception'
  routeStatus?: 'ready' | 'pending' | 'failed'
  subdomainPrefix?: string
  fullDomain?: string
  defaultAppCode?: string
  appIds?: number[]
  lastActiveAt?: string
}

export interface TenantFormValues {
  tenantId: string
  appPermissionMask: string
  selectedAppIds?: number[]
  appIds?: number[]
  tenantName: string
  status: TenantStatus
  extJson?: string
  operatorId: string
  shortName?: string
  contactName?: string
  contactMobile?: string
  contactEmail?: string
  remark?: string
  initStatus?: 'completed' | 'pending' | 'exception'
  routeStatus?: 'ready' | 'pending' | 'failed'
  subdomainPrefix?: string
  fullDomain?: string
  defaultAppCode?: string
}
