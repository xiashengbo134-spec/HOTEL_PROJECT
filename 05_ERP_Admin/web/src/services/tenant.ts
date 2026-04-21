import { request } from '../api/http'
import type { Tenant, TenantFormValues } from '../types/tenant'

export const listTenants = async (): Promise<Tenant[]> => {
  return request<Tenant[]>({ url: '/admin/tenants', method: 'GET' })
}

export const createTenant = async (payload: TenantFormValues): Promise<Tenant> => {
  return request<Tenant>({ url: '/admin/tenants', method: 'POST', data: payload })
}

export const updateTenant = async (
  id: number,
  payload: TenantFormValues,
): Promise<Tenant> => {
  return request<Tenant>({
    url: `/admin/tenants/${id}`,
    method: 'PUT',
    data: payload,
  })
}

export const deleteTenant = async (
  id: number,
  operatorId: string,
): Promise<Tenant> => {
  return request<Tenant>({
    url: `/admin/tenants/${id}`,
    method: 'DELETE',
    data: { operatorId },
  })
}
