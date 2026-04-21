import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { AuthUser } from './auth-user.interface';
import { JwtPayload } from './jwt-payload.interface';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: process.env.JWT_SECRET ?? 'erp_admin_jwt_secret'
    });
  }

  validate(payload: JwtPayload): AuthUser {
    return {
      userId: payload.sub,
      uid: payload.uid,
      username: payload.username,
      tenantId: payload.tenantId,
      roleCode: payload.roleCode
    };
  }
}
