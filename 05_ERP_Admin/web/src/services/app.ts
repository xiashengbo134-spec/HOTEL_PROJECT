import { request } from '../api/http'
import type { AdminApp } from '../types/app'
import {
  demoCreateApp,
  demoDeleteApp,
  demoListApps,
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
}

export const listApps = async (): Promise<AdminApp[]> => {
  if (isDemoMode()) {
    return demoListApps()
  }
  return request<AdminApp[]>({ url: '/admin/apps', method: 'GET' })
}

export const createApp = async (payload: AppPayload): Promise<AdminApp> => {
  if (isDemoMode()) {
    return demoCreateApp(payload)
  }
  return request<AdminApp>({ url: '/admin/apps', method: 'POST', data: payload })
}

export const updateApp = async (id: number, payload: AppPayload): Promise<AdminApp> => {
  if (isDemoMode()) {
    return demoUpdateApp(id, payload)
  }
  return request<AdminApp>({
    url: `/admin/apps/${id}`,
    method: 'PUT',
    data: payload,
  })
}

export const deleteApp = async (id: number, operatorId: string): Promise<AdminApp> => {
  if (isDemoMode()) {
    return demoDeleteApp(id)
  }
  return request<AdminApp>({
    url: `/admin/apps/${id}`,
    method: 'DELETE',
    data: { operatorId },
  })
}

export const toggleAppStatus = async (id: number, enabled: boolean, operatorId: string): Promise<AdminApp> => {
  if (isDemoMode()) {
    return demoToggleApp(id, enabled)
  }
  return request<AdminApp>({
    url: `/admin/apps/${id}`,
    method: 'PATCH',
    data: { enabled, operatorId },
  })
}
