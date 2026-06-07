import {
  Inject,
  Injectable,
  Scope,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { CONTEXT } from '@nestjs/graphql';
import { JwtService } from '@nestjs/jwt';
import { TenantStatus, UserStatus } from '../../prisma/generated-client';
import { PrismaService } from '../../prisma/prisma.service';
import { AuthenticatedUser, AuthRequest, AuthTokenPayload } from './auth.types';

const SYSTEM_TENANT_SLUG = 'vitalbite-system';

@Injectable({ scope: Scope.REQUEST })
export class AuthContextService {
  constructor(
    @Inject(CONTEXT) private readonly context: { req?: AuthRequest },
    private readonly configService: ConfigService,
    private readonly jwtService: JwtService,
    private readonly prisma: PrismaService,
  ) {}

  async getCurrentUser(): Promise<AuthenticatedUser> {
    const request = this.context.req;

    if (request?.currentUser) {
      return request.currentUser;
    }

    const token = this.extractBearerToken(request);
    let payload: AuthTokenPayload;

    try {
      payload = await this.jwtService.verifyAsync<AuthTokenPayload>(token, {
        secret: this.getJwtSecret(),
      });
    } catch {
      throw new UnauthorizedException('Invalid or expired token.');
    }

    const user = await this.prisma.user.findFirst({
      where: {
        id: payload.sub,
        tenantId: payload.tenantId,
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

    if (!user) {
      throw new UnauthorizedException('Authenticated user was not found.');
    }

    if (!this.canAccessTenant(user)) {
      throw new UnauthorizedException('Tenant is not active.');
    }

    if (request) {
      request.currentUser = user;
    }

    return user;
  }

  private extractBearerToken(request?: AuthRequest) {
    const authorization = request?.headers.authorization;
    const [type, token] = authorization?.split(' ') ?? [];

    if (type !== 'Bearer' || !token) {
      throw new UnauthorizedException('Authorization token is required.');
    }

    return token;
  }

  private getJwtSecret() {
    const secret = this.configService.get<string>('jwtSecret');

    if (!secret) {
      throw new Error('JWT_SECRET is required to authenticate requests.');
    }

    return secret;
  }

  private canAccessTenant(user: AuthenticatedUser) {
    const roleCode = user.roleCode.trim().toUpperCase();
    if (roleCode === 'SUPER_ADMIN' && user.tenant.slug === SYSTEM_TENANT_SLUG) {
      return true;
    }

    return user.tenant.status === TenantStatus.ACTIVE;
  }
}
