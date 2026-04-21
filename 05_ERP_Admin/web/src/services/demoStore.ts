import type { AdminApp, AppStatus } from '../types/app'
import type { Tenant, TenantFormValues, TenantStatus } from '../types/tenant'
import type { AdminUser, CreateUserPayload } from '../types/user'
import type { AppPayload } from './app'

const DEMO_APPS_KEY = 'erp_admin_demo_apps'
const DEMO_TENANTS_KEY = 'erp_admin_demo_tenants'
const DEMO_USERS_KEY = 'erp_admin_demo_users'

const now = () => new Date().toISOString()
const appIdFromCode = (code: string) => `app_${code.toLowerCase()}`
const secretFromCode = (code: string) => `${code.slice(0, 4).toUpperCase()}-SECRET-${Date.now().toString().slice(-6)}`

const isBrowser = typeof window !== 'undefined'

export const isDemoMode = () =>
  isBrowser && (window.location.hostname.includes('github.io') || window.location.hostname === '127.0.0.1')

const encodeMask = (ids: number[]): string => {
  let mask = 0n
  for (const id of ids) {
    mask |= 1n << BigInt(id)
  }
  return mask.toString()
}

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

const seedApps: AdminApp[] = [
  {
    id: 1,
    tenantId: 'global',
    appCode: 'ERP_ADMIN',
    appName: 'ERP 超级管理后台',
    appType: 'ERP 后台',
    appDesc: '维护平台级应用注册、接入协议、权限边界与租户分发关系。',
    baseUrl: '/erp-admin',
    homeUrl: '/erp-admin/dashboard',
    enabled: true,
    status: 'enabled',
    tenantAccessEnabled: true,
    defaultOpenToTenant: false,
    authMode: 'IDaaS',
    appId: appIdFromCode('ERP_ADMIN'),
    appSecretMasked: 'ERP_-SECRET-1024',
    tokenTtl: 7200,
    refreshTokenTtl: 604800,
    callbackUrls: ['https://erp-admin.demo/callback'],
    operatorId: 'demo_admin',
    createdAt: now(),
    updatedAt: now(),
    secretRotatedAt: now(),
    menuCount: 24,
    permissionCount: 86,
  },
  {
    id: 2,
    tenantId: 'global',
    appCode: 'SAAS_WORKSTATION',
    appName: 'SaaS 工作站',
    appType: 'SaaS 工作台',
    appDesc: '租户运营工作台与业务协同入口。',
    baseUrl: '/saas-workstation',
    homeUrl: '/saas-workstation/home',
    enabled: true,
    status: 'enabled',
    tenantAccessEnabled: true,
    defaultOpenToTenant: true,
    authMode: 'OAuth2',
    appId: appIdFromCode('SAAS_WORKSTATION'),
    appSecretMasked: 'SAAS-SECRET-2048',
    tokenTtl: 7200,
    refreshTokenTtl: 604800,
    callbackUrls: ['https://saas.demo/callback'],
    operatorId: 'demo_admin',
    createdAt: now(),
    updatedAt: now(),
    secretRotatedAt: now(),
    menuCount: 36,
    permissionCount: 128,
  },
  {
    id: 3,
    tenantId: 'global',
    appCode: 'B2B_PLATFORM',
    appName: 'B2B 平台',
    appType: 'B2B 平台',
    appDesc: '对外采购协同与供应商门户。',
    baseUrl: '/b2b-platform',
    homeUrl: '/b2b-platform/home',
    enabled: true,
    status: 'testing',
    tenantAccessEnabled: true,
    defaultOpenToTenant: false,
    authMode: 'OAuth2',
    appId: appIdFromCode('B2B_PLATFORM'),
    appSecretMasked: 'B2B_-SECRET-4096',
    tokenTtl: 3600,
    refreshTokenTtl: 259200,
    callbackUrls: ['https://b2b.demo/callback'],
    operatorId: 'demo_admin',
    createdAt: now(),
    updatedAt: now(),
    secretRotatedAt: now(),
    menuCount: 18,
    permissionCount: 54,
  },
]

const seedTenants: Tenant[] = [
  {
    id: 1,
    tenantId: 'tenant_demo_001',
    tenantName: '演示租户',
    shortName: '演示',
    status: 'active',
    initStatus: 'completed',
    routeStatus: 'ready',
    subdomainPrefix: 'demo001',
    fullDomain: 'demo001.example.com',
    defaultAppCode: 'SAAS_WORKSTATION',
    appIds: [1, 2, 3],
    appPermissionMask: encodeMask([1, 2, 3]),
    contactName: '张经理',
    contactMobile: '13800000000',
    contactEmail: 'demo001@example.com',
    remark: '用于演示全链路租户配置。',
    extJson: '{"region":"CN","edition":"pro"}',
    operatorId: 'demo_admin',
    createdAt: now(),
    updatedAt: now(),
    lastActiveAt: now(),
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

const readApps = () => readList(DEMO_APPS_KEY, seedApps)
const writeApps = (value: AdminApp[]) => writeList(DEMO_APPS_KEY, value)
const readTenants = () => readList(DEMO_TENANTS_KEY, seedTenants)
const writeTenants = (value: Tenant[]) => writeList(DEMO_TENANTS_KEY, value)

const normalizeAppStatus = (enabled: boolean, status?: AppStatus): AppStatus => {
  if (status) return status
  return enabled ? 'enabled' : 'disabled'
}

const ensureTenantMask = (appIds: number[] | undefined, raw: string | undefined) =>
  appIds && appIds.length ? encodeMask(appIds) : raw || '0'

export const demoListApps = async (): Promise<AdminApp[]> => readApps()

export const demoCreateApp = async (payload: AppPayload): Promise<AdminApp> => {
  const apps = readApps()
  if (apps.some((item) => item.appCode === payload.appCode)) {
    throw new Error('应用 Code 已存在')
  }
  const created: AdminApp = {
    id: nextId(apps),
    tenantId: payload.tenantId,
    appCode: payload.appCode,
    appName: payload.appName,
    appType: payload.appType || '内部支撑系统',
    appDesc: payload.appDesc || '',
    baseUrl: payload.baseUrl,
    homeUrl: payload.homeUrl || payload.baseUrl,
    enabled: payload.enabled,
    status: normalizeAppStatus(payload.enabled, payload.status),
    tenantAccessEnabled: payload.tenantAccessEnabled ?? true,
    defaultOpenToTenant: payload.defaultOpenToTenant ?? false,
    authMode: payload.authMode || 'IDaaS',
    appId: payload.appId || appIdFromCode(payload.appCode),
    appSecretMasked: payload.appSecretMasked || secretFromCode(payload.appCode),
    tokenTtl: payload.tokenTtl ?? 7200,
    refreshTokenTtl: payload.refreshTokenTtl ?? 604800,
    callbackUrls: payload.callbackUrls ?? [],
    operatorId: payload.operatorId,
    createdAt: now(),
    updatedAt: now(),
    secretRotatedAt: now(),
    menuCount: payload.menuCount ?? 0,
    permissionCount: payload.permissionCount ?? 0,
  }
  writeApps([created, ...apps])
  return created
}

export const demoUpdateApp = async (id: number, payload: AppPayload): Promise<AdminApp> => {
  const apps = readApps()
  const current = apps.find((app) => app.id === id)
  if (!current) throw new Error('应用不存在')
  if (apps.some((item) => item.id !== id && item.appCode === payload.appCode)) {
    throw new Error('应用 Code 已存在')
  }
  const updated: AdminApp = {
    ...current,
    ...payload,
    enabled: payload.enabled,
    status: normalizeAppStatus(payload.enabled, payload.status ?? current.status),
    updatedAt: now(),
  }
  writeApps(apps.map((app) => (app.id === id ? updated : app)))
  return updated
}

export const demoDeleteApp = async (id: number): Promise<AdminApp> => {
  const apps = readApps()
  const current = apps.find((app) => app.id === id)
  if (!current) throw new Error('应用不存在')
  writeApps(apps.filter((app) => app.id !== id))

  const tenants = readTenants().map((tenant) => {
    const nextAppIds = (tenant.appIds ?? []).filter((appId) => appId !== id)
    const defaultAppStillExists = apps
      .filter((app) => app.id !== id)
      .some((app) => app.appCode === tenant.defaultAppCode)
    return {
      ...tenant,
      appIds: nextAppIds,
      appPermissionMask: ensureTenantMask(nextAppIds, tenant.appPermissionMask),
      defaultAppCode: defaultAppStillExists
        ? tenant.defaultAppCode
        : apps.filter((app) => app.id !== id)[0]?.appCode,
      updatedAt: now(),
    }
  })
  writeTenants(tenants)
  return current
}

export const demoToggleApp = async (id: number, enabled: boolean): Promise<AdminApp> => {
  const apps = readApps()
  const current = apps.find((app) => app.id === id)
  if (!current) throw new Error('应用不存在')
  const updated: AdminApp = {
    ...current,
    enabled,
    status: enabled ? 'enabled' : 'disabled',
    updatedAt: now(),
  }
  writeApps(apps.map((app) => (app.id === id ? updated : app)))
  return updated
}

export const demoRotateSecret = async (id: number): Promise<AdminApp> => {
  const apps = readApps()
  const current = apps.find((app) => app.id === id)
  if (!current) throw new Error('应用不存在')
  const updated: AdminApp = {
    ...current,
    appSecretMasked: secretFromCode(current.appCode),
    secretRotatedAt: now(),
    updatedAt: now(),
  }
  writeApps(apps.map((app) => (app.id === id ? updated : app)))
  return updated
}

export const demoDistributeApp = async (appId: number, tenantIds: number[]): Promise<void> => {
  const tenants = readTenants()
  const apps = readApps()
  const targetApp = apps.find((item) => item.id === appId)
  if (!targetApp) throw new Error('应用不存在')
  const nextTenants = tenants.map((tenant) => {
    const hasApp = (tenant.appIds ?? []).includes(appId)
    const shouldHave = tenantIds.includes(tenant.id)
    let appIds = tenant.appIds ?? []
    if (shouldHave && !hasApp) appIds = [...appIds, appId]
    if (!shouldHave && hasApp) appIds = appIds.filter((id) => id !== appId)
    const defaultAppCode = appIds.length
      ? appIds.some((id) => apps.find((app) => app.id === id)?.appCode === tenant.defaultAppCode)
        ? tenant.defaultAppCode
        : targetApp.appCode
      : undefined
    return {
      ...tenant,
      appIds,
      appPermissionMask: ensureTenantMask(appIds, tenant.appPermissionMask),
      defaultAppCode,
      updatedAt: now(),
    }
  })
  writeTenants(nextTenants)
}

export const demoListTenants = async (): Promise<Tenant[]> => readTenants()

export const demoCreateTenant = async (payload: TenantFormValues): Promise<Tenant> => {
  const tenants = readTenants()
  if (tenants.some((item) => item.tenantId === payload.tenantId)) {
    throw new Error('租户编码已存在')
  }
  const appIds = payload.appIds ?? payload.selectedAppIds ?? []
  const created: Tenant = {
    id: nextId(tenants),
    tenantId: payload.tenantId,
    tenantName: payload.tenantName,
    shortName: payload.shortName || payload.tenantName,
    status: payload.status,
    initStatus: payload.initStatus || 'completed',
    routeStatus: payload.routeStatus || (payload.fullDomain ? 'ready' : 'pending'),
    subdomainPrefix: payload.subdomainPrefix,
    fullDomain: payload.fullDomain,
    defaultAppCode: payload.defaultAppCode,
    appIds,
    appPermissionMask: ensureTenantMask(appIds, payload.appPermissionMask),
    contactName: payload.contactName,
    contactMobile: payload.contactMobile,
    contactEmail: payload.contactEmail,
    remark: payload.remark,
    extJson: payload.extJson ?? null,
    operatorId: payload.operatorId,
    createdAt: now(),
    updatedAt: now(),
    lastActiveAt: now(),
    isDeleted: false,
  }
  writeTenants([created, ...tenants])
  return created
}

export const demoUpdateTenant = async (id: number, payload: TenantFormValues): Promise<Tenant> => {
  const tenants = readTenants()
  const current = tenants.find((tenant) => tenant.id === id)
  if (!current) throw new Error('租户不存在')
  if (tenants.some((item) => item.id !== id && item.tenantId === payload.tenantId)) {
    throw new Error('租户编码已存在')
  }
  const appIds = payload.appIds ?? payload.selectedAppIds ?? current.appIds ?? []
  const updated: Tenant = {
    ...current,
    ...payload,
    appIds,
    appPermissionMask: ensureTenantMask(appIds, payload.appPermissionMask),
    updatedAt: now(),
  }
  writeTenants(tenants.map((tenant) => (tenant.id === id ? updated : tenant)))
  return updated
}

export const demoDeleteTenant = async (id: number): Promise<Tenant> => {
  const tenants = readTenants()
  const current = tenants.find((tenant) => tenant.id === id)
  if (!current) throw new Error('租户不存在')
  writeTenants(tenants.filter((tenant) => tenant.id !== id))
  return current
}

export const demoToggleTenantStatus = async (id: number, status: TenantStatus): Promise<Tenant> => {
  const tenants = readTenants()
  const current = tenants.find((tenant) => tenant.id === id)
  if (!current) throw new Error('租户不存在')
  const updated: Tenant = {
    ...current,
    status,
    updatedAt: now(),
  }
  writeTenants(tenants.map((tenant) => (tenant.id === id ? updated : tenant)))
  return updated
}

export const demoListUsers = async (): Promise<AdminUser[]> => readList(DEMO_USERS_KEY, seedUsers)

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
