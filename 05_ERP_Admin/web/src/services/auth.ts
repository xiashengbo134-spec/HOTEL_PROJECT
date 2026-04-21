import { request } from '../api/http'
import type { LoginCommand, LoginResult, LoginUser } from '../types/auth'

export const login = async (payload: LoginCommand): Promise<LoginResult> => {
  return request<LoginResult>({
    url: '/admin/auth/login',
    method: 'POST',
    data: payload,
  })
}

export const getCurrentUser = async (): Promise<LoginUser> => {
  return request<LoginUser>({
    url: '/admin/auth/me',
    method: 'GET',
  })
}
