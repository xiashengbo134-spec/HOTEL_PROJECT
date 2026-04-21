import type { AdminApp } from '../types/app'
import type { Tenant, TenantFormValues } from '../types/tenant'
import type { AdminUser, CreateUserPayload } from '../types/user'
import type { AppPayload } from './app'

const DEMO_APPS_KEY = 'erp_admin_demo_apps'
const DEMO_TENANTS_KEY = 'erp_admin_demo_tenants'
const DEMO_USERS_KEY = 'erp_admin_demo_users'

const now = () => new Date().toISOString()

const seedApps: AdminApp[] = [
  {
    id: 1,
    tenantId: 'global',
    appCode: 'ERP_ADMIN',
    appName: 'ERP 超级管理后台',
    baseUrl: '/erp-admin',
    enabled: true,
  },
  {
    id: 2,
    tenantId: 'global',
    appCode: 'SAAS_WORKSTATION',
    appName: 'SaaS 工作站',
    baseUrl: '/saas-workstation',
    enabled: true,
  },
  {
    id: 3,
    tenantId: 'global',
    appCode: 'B2B_PLATFORM',
    appName: 'B2B 平台',
    baseUrl: '/b2b-platform',
    enabled: true,
  },
]

const seedTenants: Tenant[] = [
  {
    id: 1,
    tenantId: 'tenant_demo_001',
    tenantName: '演示租户',
    status: 'active',
    appPermissionMask: '14',
    extJson: '{"region":"CN","edition":"pro"}',
    operatorId: 'demo_admin',
    createdAt: now(),
    updatedAt: now(),
    isDeleted: false,
  },
]

const seedUsers: AdminUser[] = [
  {
    id: 1,
    uid: 'demo_admin',
    tenantId: 'demo',
    username: '演示管理员',
    roleCode: 'SYSTEM_ADMIN',
    isActive: true,
  },
]

const isBrowser = typeof window !== 'undefined'

export const isDemoMode = () =>
  isBrowser && (window.location.hostname.includes('github.io') || window.location.hostname === '127.0.0.1')

const readList = <T,>(key: string, seed: T[]): T[] => {
  if (!isBrowser) return seed
  const raw = localStorage.getItem(key)
  if (!raw) {
    localStorage.setItem(key, JSON.stringify(seed))
    return seed
  }
  try {
    return JSON.parse(raw) as T[]
  } catch {
    localStorage.setItem(key, JSON.stringify(seed))
    return seed
  }
}

const writeList = <T,>(key: string, value: T[]) => {
  if (!isBrowser) return
  localStorage.setItem(key, JSON.stringify(value))
}

const nextId = (items: Array<{ id: number }>) =>
  items.length ? Math.max(...items.map((item) => item.id)) + 1 : 1

export const demoListApps = async (): Promise<AdminApp[]> => {
  return readList(DEMO_APPS_KEY, seedApps)
}

export const demoCreateApp = async (payload: AppPayload): Promise<AdminApp> => {
  const apps = readList(DEMO_APPS_KEY, seedApps)
  const created: AdminApp = {
    id: nextId(apps),
    tenantId: payload.tenantId,
    appCode: payload.appCode,
    appName: payload.appName,
    baseUrl: payload.baseUrl,
    enabled: payload.enabled,
  }
  writeList(DEMO_APPS_KEY, [created, ...apps])
  return created
}

export const demoUpdateApp = async (id: number, payload: AppPayload): Promise<AdminApp> => {
  const apps = readList(DEMO_APPS_KEY, seedApps)
  const current = apps.find((app) => app.id === id)
  if (!current) throw new Error('应用不存在')
  const updated: AdminApp = {
    ...current,
    tenantId: payload.tenantId,
    appCode: payload.appCode,
    appName: payload.appName,
    baseUrl: payload.baseUrl,
    enabled: payload.enabled,
  }
  writeList(
    DEMO_APPS_KEY,
    apps.map((app) => (app.id === id ? updated : app)),
  )
  return updated
}

export const demoDeleteApp = async (id: number): Promise<AdminApp> => {
  const apps = readList(DEMO_APPS_KEY, seedApps)
  const current = apps.find((app) => app.id === id)
  if (!current) throw new Error('应用不存在')
  writeList(
    DEMO_APPS_KEY,
    apps.filter((app) => app.id !== id),
  )
  return current
}

export const demoToggleApp = async (id: number, enabled: boolean): Promise<AdminApp> => {
  const apps = readList(DEMO_APPS_KEY, seedApps)
  const current = apps.find((app) => app.id === id)
  if (!current) throw new Error('应用不存在')
  const updated: AdminApp = {
    ...current,
    enabled,
  }
  writeList(
    DEMO_APPS_KEY,
    apps.map((app) => (app.id === id ? updated : app)),
  )
  return updated
}

export const demoListTenants = async (): Promise<Tenant[]> => {
  return readList(DEMO_TENANTS_KEY, seedTenants)
}

export const demoCreateTenant = async (payload: TenantFormValues): Promise<Tenant> => {
  const tenants = readList(DEMO_TENANTS_KEY, seedTenants)
  const created: Tenant = {
    id: nextId(tenants),
    tenantId: payload.tenantId,
    tenantName: payload.tenantName,
    status: payload.status,
    appPermissionMask: payload.appPermissionMask,
    extJson: payload.extJson ?? null,
    operatorId: payload.operatorId,
    createdAt: now(),
    updatedAt: now(),
    isDeleted: false,
  }
  writeList(DEMO_TENANTS_KEY, [created, ...tenants])
  return created
}

export const demoUpdateTenant = async (id: number, payload: TenantFormValues): Promise<Tenant> => {
  const tenants = readList(DEMO_TENANTS_KEY, seedTenants)
  const current = tenants.find((tenant) => tenant.id === id)
  if (!current) throw new Error('租户不存在')
  const updated: Tenant = {
    ...current,
    tenantId: payload.tenantId,
    tenantName: payload.tenantName,
    status: payload.status,
    appPermissionMask: payload.appPermissionMask,
    extJson: payload.extJson ?? null,
    operatorId: payload.operatorId,
    updatedAt: now(),
  }
  writeList(
    DEMO_TENANTS_KEY,
    tenants.map((tenant) => (tenant.id === id ? updated : tenant)),
  )
  return updated
}

export const demoDeleteTenant = async (id: number): Promise<Tenant> => {
  const tenants = readList(DEMO_TENANTS_KEY, seedTenants)
  const current = tenants.find((tenant) => tenant.id === id)
  if (!current) throw new Error('租户不存在')
  writeList(
    DEMO_TENANTS_KEY,
    tenants.filter((tenant) => tenant.id !== id),
  )
  return current
}

export const demoListUsers = async (): Promise<AdminUser[]> => {
  return readList(DEMO_USERS_KEY, seedUsers)
}

export const demoCreateUser = async (payload: CreateUserPayload): Promise<AdminUser> => {
  const users = readList(DEMO_USERS_KEY, seedUsers)
  const created: AdminUser = {
    id: nextId(users),
    uid: payload.uid,
    username: payload.username,
    tenantId: payload.tenantId ?? null,
    roleCode: payload.roleCode,
    isActive: payload.isActive,
  }
  writeList(DEMO_USERS_KEY, [created, ...users])
  return created
}
