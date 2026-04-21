export interface AuthUser {
  userId: number;
  uid: string;
  username: string;
  tenantId: string | null;
  roleCode: string;
}
