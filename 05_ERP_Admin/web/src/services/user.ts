import { request } from '../api/http'
import type { AdminUser, CreateUserPayload } from '../types/user'

export const listUsers = async (): Promise<AdminUser[]> => {
  return request<AdminUser[]>({ url: '/admin/users', method: 'GET' })
}

export const createUser = async (payload: CreateUserPayload): Promise<AdminUser> => {
  return request<AdminUser>({ url: '/admin/users', method: 'POST', data: payload })
}
