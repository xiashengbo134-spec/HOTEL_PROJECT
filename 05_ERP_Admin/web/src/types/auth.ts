export interface LoginCommand {
  uid: string
  password: string
}

export interface LoginUser {
  userId: number
  uid: string
  username: string
  tenantId: string | null
  roleCode: string
}

export interface LoginResult {
  token: string
  user: LoginUser
}
