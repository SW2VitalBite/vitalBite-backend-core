import {
  ConflictException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { compare, hash } from 'bcryptjs';
import {
  PatientStatus,
  TenantStatus,
  UserStatus,
} from '../../prisma/generated-client';
import { PrismaService } from '../../prisma/prisma.service';
import { LoginInput } from './dto/login.input';
import { RegisterInput } from './dto/register.input';
import { JoinTenantInput } from './dto/join-tenant.input';
import { AuthSessionModel } from './models/auth-session.model';
import { UserModel } from '../users/models/user.model';

@Injectable()
export class AuthService {
  constructor(
    private readonly configService: ConfigService,
    private readonly jwtService: JwtService,
    private readonly prisma: PrismaService,
  ) {}

  async login(input: LoginInput): Promise<AuthSessionModel> {
    const email = input.email.trim().toLowerCase();

    // Intentar login como User (nutricionista / administrador)
    const user = await this.prisma.user.findFirst({
      where: {
        email,
        status: UserStatus.ACTIVE,
        deletedAt: null,
        tenant: { deletedAt: null },
      },
      include: { tenant: true },
    });

    if (user && (await compare(input.password, user.passwordHash))) {
      const accessToken = await this.jwtService.signAsync({
        sub: user.id,
        tenantId: user.tenantId,
        email: user.email,
        roleCode: user.roleCode,
      });
      return { accessToken, user, tenant: user.tenant };
    }

    // Intentar login como Patient (app móvil)
    const patient = await this.prisma.patient.findFirst({
      where: {
        email,
        deletedAt: null,
        status: { not: PatientStatus.ARCHIVED },
        tenant: { deletedAt: null },
      },
      include: { tenant: true },
    });

    if (
      !patient ||
      !patient.passwordHash ||
      !(await compare(input.password, patient.passwordHash))
    ) {
      throw new UnauthorizedException('Invalid email or password.');
    }

    const accessToken = await this.jwtService.signAsync({
      sub: patient.id,
      tenantId: patient.tenantId,
      email: patient.email,
      roleCode: 'PACIENTE',
    });

    const patientAsUser: UserModel = {
      id: patient.id,
      tenantId: patient.tenantId,
      email: patient.email ?? '',
      firstName: patient.firstName,
      lastName: patient.lastName,
      status: UserStatus.ACTIVE,
      roleCode: 'PACIENTE',
      createdAt: patient.createdAt,
      updatedAt: patient.updatedAt,
    };

    return { accessToken, user: patientAsUser, tenant: patient.tenant };
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
      throw new ConflictException(
        'An active account with this email already exists.',
      );
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

  async joinTenant(input: JoinTenantInput): Promise<AuthSessionModel> {
    const email = input.email.trim().toLowerCase();
    const officeCode = input.officeCode.trim().toLowerCase();

    const tenant = await this.prisma.tenant.findFirst({
      where: {
        slug: officeCode,
        status: TenantStatus.ACTIVE,
        deletedAt: null,
      },
    });

    if (!tenant) {
      throw new NotFoundException(
        'No se encontró ningún consultorio con ese código.',
      );
    }

    const existing = await this.prisma.patient.findFirst({
      where: { email, tenantId: tenant.id, deletedAt: null },
    });

    if (existing) {
      throw new ConflictException(
        'Ya existe un paciente con ese correo en este consultorio.',
      );
    }

    // Buscar al primer nutricionista activo del tenant para asignarlo
    const nutritionist = await this.prisma.user.findFirst({
      where: {
        tenantId: tenant.id,
        status: UserStatus.ACTIVE,
        deletedAt: null,
      },
    });

    if (!nutritionist) {
      throw new NotFoundException(
        'El consultorio no tiene nutricionistas activos.',
      );
    }

    const passwordHash = await hash(input.password, 10);

    const patient = await this.prisma.patient.create({
      data: {
        tenantId: tenant.id,
        nutritionistId: nutritionist.id,
        firstName: input.firstName.trim(),
        lastName: input.lastName.trim(),
        email,
        passwordHash,
        status: PatientStatus.ACTIVE,
      },
      include: { tenant: true },
    });

    const accessToken = await this.jwtService.signAsync({
      sub: patient.id,
      tenantId: patient.tenantId,
      email: patient.email,
      roleCode: 'PACIENTE',
    });

    const patientAsUser: UserModel = {
      id: patient.id,
      tenantId: patient.tenantId,
      email: patient.email ?? '',
      firstName: patient.firstName,
      lastName: patient.lastName,
      status: UserStatus.ACTIVE,
      roleCode: 'PACIENTE',
      createdAt: patient.createdAt,
      updatedAt: patient.updatedAt,
    };

    return { accessToken, user: patientAsUser, tenant };
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
}
