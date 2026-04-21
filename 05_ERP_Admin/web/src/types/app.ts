export type AppStatus = 'enabled' | 'disabled' | 'testing' | 'deprecated'

export interface AdminApp {
  id: number
  tenantId: string
  appCode: string
  appName: string
  baseUrl: string
  enabled: boolean
  status?: AppStatus
  appType?: string
  appDesc?: string
  homeUrl?: string
  appId?: string
  appSecretMasked?: string
  authMode?: string
  callbackUrls?: string[]
  tokenTtl?: number
  refreshTokenTtl?: number
  tenantAccessEnabled?: boolean
  defaultOpenToTenant?: boolean
  operatorId?: string
  createdAt?: string
  updatedAt?: string
  secretRotatedAt?: string
  menuCount?: number
  permissionCount?: number
}
