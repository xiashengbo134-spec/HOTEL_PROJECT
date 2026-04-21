export interface AdminUser {
  id: number
  uid: string
  tenantId: string | null
  username: string
  roleCode: string
  isActive: boolean
}

export interface CreateUserPayload {
  uid: string
  tenantId?: string | null
  username: string
  password: string
  roleCode: string
  isActive: boolean
  operatorId: string
}
