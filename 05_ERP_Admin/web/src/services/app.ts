import { request } from '../api/http'
import type { AdminApp, AppStatus } from '../types/app'
import {
  demoCreateApp,
  demoDeleteApp,
  demoDistributeApp,
  demoListApps,
  demoRotateSecret,
  demoToggleApp,
  demoUpdateApp,
  isDemoMode,
} from './demoStore'

export interface AppPayload {
  tenantId: string
  appCode: string
  appName: string
  baseUrl: string
  enabled: boolean
  operatorId: string
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
  status?: AppStatus
  menuCount?: number
  permissionCount?: number
}

export const listApps = async (): Promise<AdminApp[]> => {
  if (isDemoMode()) return demoListApps()
  return request<AdminApp[]>({ url: '/admin/apps', method: 'GET' })
}

export const createApp = async (payload: AppPayload): Promise<AdminApp> => {
  if (isDemoMode()) return demoCreateApp(payload)
  return request<AdminApp>({ url: '/admin/apps', method: 'POST', data: payload })
}

export const updateApp = async (id: number, payload: AppPayload): Promise<AdminApp> => {
  if (isDemoMode()) return demoUpdateApp(id, payload)
  return request<AdminApp>({ url: `/admin/apps/${id}`, method: 'PUT', data: payload })
}

export const deleteApp = async (id: number, operatorId: string): Promise<AdminApp> => {
  if (isDemoMode()) return demoDeleteApp(id)
  return request<AdminApp>({ url: `/admin/apps/${id}`, method: 'DELETE', data: { operatorId } })
}

export const toggleAppStatus = async (
  id: number,
  enabled: boolean,
  operatorId: string,
): Promise<AdminApp> => {
  if (isDemoMode()) return demoToggleApp(id, enabled)
  return request<AdminApp>({
    url: `/admin/apps/${id}/status`,
    method: 'PATCH',
    data: { enabled, operatorId },
  })
}

export const rotateAppSecret = async (id: number): Promise<AdminApp> => {
  if (isDemoMode()) return demoRotateSecret(id)
  return request<AdminApp>({ url: `/admin/apps/${id}/secret/rotate`, method: 'POST' })
}

export const distributeAppTenants = async (id: number, tenantIds: number[]): Promise<void> => {
  if (isDemoMode()) return demoDistributeApp(id, tenantIds)
  await request<void>({ url: `/admin/apps/${id}/tenants`, method: 'PUT', data: { tenantIds } })
}
