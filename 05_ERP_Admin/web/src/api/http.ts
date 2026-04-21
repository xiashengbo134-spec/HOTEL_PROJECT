import axios, { type AxiosRequestConfig } from 'axios'
import type { ApiResponse } from '../types/api'
import { authStorage } from '../auth/storage'

const http = axios.create({
  baseURL: '/api',
  timeout: 10000,
})

http.interceptors.request.use((config) => {
  const token = authStorage.getToken()
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

http.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error?.response?.status === 401) {
      authStorage.clear()
      window.location.href = '/login'
      return Promise.reject(new Error('登录状态已过期，请重新登录'))
    }
    const message =
      error?.response?.data?.message || error?.message || '网络请求失败'
    return Promise.reject(new Error(message))
  },
)

export const request = async <T>(config: AxiosRequestConfig): Promise<T> => {
  const response = await http.request<ApiResponse<T>>(config)
  const payload = response.data
  if (typeof payload?.code !== 'number') {
    throw new Error('接口响应格式错误')
  }
  if (payload.code !== 200) {
    throw new Error(payload.message || '请求失败')
  }
  return payload.data
}
