import type { LoginUser } from '../types/auth'

const TOKEN_KEY = 'erp_admin_token'
const USER_KEY = 'erp_admin_user'

export const authStorage = {
  getToken(): string | null {
    return localStorage.getItem(TOKEN_KEY)
  },
  setToken(token: string) {
    localStorage.setItem(TOKEN_KEY, token)
  },
  getUser(): LoginUser | null {
    const raw = localStorage.getItem(USER_KEY)
    if (!raw) return null
    try {
      return JSON.parse(raw) as LoginUser
    } catch {
      return null
    }
  },
  setUser(user: LoginUser) {
    localStorage.setItem(USER_KEY, JSON.stringify(user))
  },
  clear() {
    localStorage.removeItem(TOKEN_KEY)
    localStorage.removeItem(USER_KEY)
  },
}
