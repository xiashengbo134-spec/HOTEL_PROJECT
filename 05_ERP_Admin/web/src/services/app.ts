import { request } from '../api/http'
import type { AdminApp } from '../types/app'

export interface AppPayload {
  tenantId: string
  appCode: string
  appName: string
  baseUrl: string
  enabled: boolean
  operatorId: string
}

export const listApps = async (): Promise<AdminApp[]> => {
  return request<AdminApp[]>({ url: '/admin/apps', method: 'GET' })
}

export const createApp = async (payload: AppPayload): Promise<AdminApp> => {
  return request<AdminApp>({ url: '/admin/apps', method: 'POST', data: payload })
}
