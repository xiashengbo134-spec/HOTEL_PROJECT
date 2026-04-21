import { request } from '../api/http'
import type { Tenant, TenantFormValues, TenantStatus } from '../types/tenant'
import {
  demoCreateTenant,
  demoDeleteTenant,
  demoListTenants,
  demoToggleTenantStatus,
  demoUpdateTenant,
  isDemoMode,
} from './demoStore'

export const listTenants = async (): Promise<Tenant[]> => {
  if (isDemoMode()) return demoListTenants()
  return request<Tenant[]>({ url: '/admin/tenants', method: 'GET' })
}

export const createTenant = async (payload: TenantFormValues): Promise<Tenant> => {
  if (isDemoMode()) return demoCreateTenant(payload)
  return request<Tenant>({ url: '/admin/tenants', method: 'POST', data: payload })
}

export const updateTenant = async (id: number, payload: TenantFormValues): Promise<Tenant> => {
  if (isDemoMode()) return demoUpdateTenant(id, payload)
  return request<Tenant>({ url: `/admin/tenants/${id}`, method: 'PUT', data: payload })
}

export const deleteTenant = async (id: number, operatorId: string): Promise<Tenant> => {
  if (isDemoMode()) return demoDeleteTenant(id)
  return request<Tenant>({ url: `/admin/tenants/${id}`, method: 'DELETE', data: { operatorId } })
}

export const toggleTenantStatus = async (id: number, status: TenantStatus): Promise<Tenant> => {
  if (isDemoMode()) return demoToggleTenantStatus(id, status)
  return request<Tenant>({ url: `/admin/tenants/${id}/status`, method: 'PATCH', data: { status } })
}
