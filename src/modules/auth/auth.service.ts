import {
  ConflictException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { compare, hash } from 'bcryptjs';
import { TenantStatus, UserStatus } from '../../prisma/generated-client';
import { PrismaService } from '../../prisma/prisma.service';
import { LoginInput } from './dto/login.input';
import { RegisterInput } from './dto/register.input';
import { AuthSessionModel } from './models/auth-session.model';

const SYSTEM_TENANT_SLUG = 'vitalbite-system';

@Injectable()
export class AuthService {
  constructor(
    private readonly configService: ConfigService,
    private readonly jwtService: JwtService,
    private readonly prisma: PrismaService,
  ) {}

  async login(input: LoginInput): Promise<AuthSessionModel> {
    const email = input.email.trim().toLowerCase();
    const user = await this.prisma.user.findFirst({
      where: {
        email,
        status: UserStatus.ACTIVE,
        deletedAt: null,
        tenant: {
          deletedAt: null,
        },
      },
      include: {
        tenant: true,
      },
    });

    if (!user || !(await compare(input.password, user.passwordHash))) {
      throw new UnauthorizedException('Invalid email or password.');
    }

    if (!this.canAccessTenant(user)) {
      throw new UnauthorizedException('Tenant is not active.');
    }

    const accessToken = await this.jwtService.signAsync({
      sub: user.id,
      tenantId: user.tenantId,
      email: user.email,
      roleCode: user.roleCode,
    });

    return {
      accessToken,
      user,
      tenant: user.tenant,
    };
  }

  async register(input: RegisterInput): Promise<AuthSessionModel> {
    const email = input.email.trim().toLowerCase();
    const clinicName = input.clinicName.trim();
    const { firstName, lastName } = this.splitFullName(input.fullName);

    const existingUser = await this.prisma.user.findFirst({
      where: {
        email,
        deletedAt: null,
      },
    });

    if (existingUser) {
      throw new ConflictException('An active account with this email already exists.');
    }

    const passwordHash = await hash(input.password, 10);
    const slug = await this.createUniqueTenantSlug(clinicName);

    const { user, tenant } = await this.prisma.$transaction(async (prisma) => {
      const tenant = await prisma.tenant.create({
        data: {
          name: clinicName,
          slug,
          status: TenantStatus.ACTIVE,
        },
      });

      const user = await prisma.user.create({
        data: {
          tenantId: tenant.id,
          email,
          passwordHash,
          firstName,
          lastName,
          status: UserStatus.ACTIVE,
          roleCode: 'NUTRICIONISTA',
        },
        include: {
          tenant: true,
        },
      });

      return {
        user,
        tenant,
      };
    });

    const accessToken = await this.jwtService.signAsync({
      sub: user.id,
      tenantId: user.tenantId,
      email: user.email,
      roleCode: user.roleCode,
    });

    return {
      accessToken,
      user,
      tenant,
    };
  }

  getJwtOptions() {
    const secret = this.configService.get<string>('jwtSecret');

    if (!secret) {
      throw new Error('JWT_SECRET is required to start authentication.');
    }

    const expiresIn = (this.configService.get<string>('jwtExpiresIn') ??
      '8h') as never;

    return {
      secret,
      signOptions: {
        expiresIn,
      },
    };
  }

  private splitFullName(fullName: string) {
    const parts = fullName.trim().replace(/\s+/g, ' ').split(' ');
    const firstName = parts.shift() ?? fullName.trim();
    const lastName = parts.join(' ') || firstName;

    return {
      firstName,
      lastName,
    };
  }

  private async createUniqueTenantSlug(clinicName: string) {
    const baseSlug =
      clinicName
        .trim()
        .toLowerCase()
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-+|-+$/g, '') || 'centro';

    let slug = baseSlug;
    let suffix = 2;

    while (
      await this.prisma.tenant.findFirst({
        where: {
          slug,
          deletedAt: null,
        },
      })
    ) {
      slug = `${baseSlug}-${suffix}`;
      suffix += 1;
    }

    return slug;
  }

  private canAccessTenant(user: {
    roleCode: string;
    tenant: { slug: string; status: TenantStatus };
  }) {
    const roleCode = user.roleCode.trim().toUpperCase();
    if (roleCode === 'SUPER_ADMIN' && user.tenant.slug === SYSTEM_TENANT_SLUG) {
      return true;
    }

    return user.tenant.status === TenantStatus.ACTIVE;
  }
}
