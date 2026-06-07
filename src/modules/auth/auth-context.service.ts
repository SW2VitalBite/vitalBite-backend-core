import {
  Inject,
  Injectable,
  Scope,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { CONTEXT } from '@nestjs/graphql';
import { JwtService } from '@nestjs/jwt';
import { UserStatus } from '../../prisma/generated-client';
import { PrismaService } from '../../prisma/prisma.service';
import { AuthenticatedUser, AuthRequest, AuthTokenPayload } from './auth.types';

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

    // Intentar resolver como User (nutricionista / administrador)
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

    if (user) {
      if (request) {
        request.currentUser = user;
      }
      return user;
    }

    // Intentar resolver como Patient (app móvil — roleCode === 'PACIENTE')
    if (payload.roleCode === 'PACIENTE') {
      const patient = await this.prisma.patient.findFirst({
        where: {
          id: payload.sub,
          tenantId: payload.tenantId,
          deletedAt: null,
          tenant: { deletedAt: null },
        },
        include: { tenant: true },
      });

      if (patient) {
        // Proyección compatible con AuthenticatedUser para uso en servicios
        const patientAsUser = {
          id: patient.id,
          tenantId: patient.tenantId,
          email: patient.email ?? '',
          firstName: patient.firstName,
          lastName: patient.lastName,
          passwordHash: '',
          status: UserStatus.ACTIVE,
          roleCode: 'PACIENTE',
          tenant: patient.tenant,
          assignedPatients: [],
          nutritionistAppointments: [],
          registeredBodyMeasurements: [],
          nutritionistDiets: [],
          createdAt: patient.createdAt,
          updatedAt: patient.updatedAt,
          deletedAt: patient.deletedAt,
        } as unknown as AuthenticatedUser;

        if (request) {
          request.currentUser = patientAsUser;
        }

        return patientAsUser;
      }
    }

    throw new UnauthorizedException('Authenticated user was not found.');
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
}
