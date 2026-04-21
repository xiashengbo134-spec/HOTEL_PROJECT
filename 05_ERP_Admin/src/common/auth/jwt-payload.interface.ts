export interface JwtPayload {
  sub: number;
  uid: string;
  username: string;
  tenantId: string | null;
  roleCode: string;
}
