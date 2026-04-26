import { request } from '../api/http'
import type { AdminUser, CreateUserPayload } from '../types/user'
import { demoCreateUser, demoListUsers, isDemoMode } from './demoStore'

export const listUsers = async (): Promise<AdminUser[]> => {
  if (isDemoMode()) {
    return demoListUsers()
  }
  return request<AdminUser[]>({ url: '/admin/users', method: 'GET' })
}

export const createUser = async (payload: CreateUserPayload): Promise<AdminUser> => {
  if (isDemoMode()) {
    return demoCreateUser(payload)
  }
  return request<AdminUser>({ url: '/admin/users', method: 'POST', data: payload })
}
