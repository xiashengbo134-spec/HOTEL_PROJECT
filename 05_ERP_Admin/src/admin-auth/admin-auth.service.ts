import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import * as bcrypt from 'bcrypt';
import { Repository } from 'typeorm';
import { AdminAuthSessionEntity } from '../common/entities/admin-auth-session.entity';
import { JwtPayload } from '../common/auth/jwt-payload.interface';
import { AdminUserEntity } from '../common/entities/admin-user.entity';

interface LoginCommand {
  uid: string;
  password: string;
}

@Injectable()
export class AdminAuthService {
  constructor(
    private readonly jwtService: JwtService,
    @InjectRepository(AdminUserEntity)
    private readonly userRepo: Repository<AdminUserEntity>,
    @InjectRepository(AdminAuthSessionEntity)
    private readonly sessionRepo: Repository<AdminAuthSessionEntity>
  ) {}

  async login(command: LoginCommand): Promise<{
    token: string;
    user: {
      userId: number;
      uid: string;
      username: string;
      tenantId: string | null;
      roleCode: string;
    };
  }> {
    const user = await this.userRepo.findOne({
      where: { uid: command.uid, isDeleted: false, isActive: true }
    });
    if (!user) {
      throw new UnauthorizedException('账号或密码错误');
    }

    const matched = await bcrypt.compare(command.password, user.passwordHash);
    if (!matched) {
      throw new UnauthorizedException('账号或密码错误');
    }

    const payload: JwtPayload = {
      sub: user.id,
      uid: user.uid,
      username: user.username,
      tenantId: user.tenantId,
      roleCode: user.roleCode
    };
    const token = await this.jwtService.signAsync(payload);

    const session = this.sessionRepo.create({
      tenantId: user.tenantId ?? 'global',
      uid: user.uid,
      accessToken: token,
      expiredAt: new Date(Date.now() + 2 * 60 * 60 * 1000),
      operatorId: user.uid,
      isDeleted: false
    });
    await this.sessionRepo.save(session);

    return {
      token,
      user: {
        userId: user.id,
        uid: user.uid,
        username: user.username,
        tenantId: user.tenantId,
        roleCode: user.roleCode
      }
    };
  }
}
