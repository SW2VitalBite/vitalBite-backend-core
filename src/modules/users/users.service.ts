import {
  ConflictException,
  ForbiddenException,
  Injectable,
  NotFoundException,
  ServiceUnavailableException,
} from '@nestjs/common';
import { hash } from 'bcryptjs';
import { Prisma, UserStatus } from '../../prisma/generated-client';
import { PrismaService } from '../../prisma/prisma.service';
import { AuditService } from '../audit/audit.service';
import { AuthenticatedUser } from '../auth/auth.types';
import { PaymentsIntegrationService } from '../payments/payments-integration.service';
import { CreateUserInput } from './dto/create-user.input';
import { UpdateUserInput } from './dto/update-user.input';

const TEMPORARY_PASSWORD = 'demo1234';
const TENANT_ADMIN_ROLES = ['ADMINISTRADOR', 'ADMIN'];
const ALLOWED_CREATE_ROLES = ['ADMINISTRADOR', 'ADMIN', 'NUTRICIONISTA'];
type TenantUser = Prisma.UserGetPayload<object>;

@Injectable()
export class UsersService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly paymentsIntegration: PaymentsIntegrationService,
    private readonly auditService: AuditService,
  ) {}

  async findTenantUsers(currentUser: AuthenticatedUser) {
    this.ensureTenantAdmin(currentUser);

    return this.prisma.user.findMany({
      where: {
        tenantId: currentUser.tenantId,
        deletedAt: null,
        roleCode: {
          not: 'SUPER_ADMIN',
        },
      },
      orderBy: [{ roleCode: 'asc' }, { firstName: 'asc' }],
    });
  }

  async createTenantUser(
    currentUser: AuthenticatedUser,
    input: CreateUserInput,
  ) {
    this.ensureTenantAdmin(currentUser);

    const roleCode = input.roleCode.trim().toUpperCase();
    if (!ALLOWED_CREATE_ROLES.includes(roleCode)) {
      throw new ForbiddenException('Role is not allowed for tenant users.');
    }

    const email = input.email.trim().toLowerCase();
    const existingUser = await this.prisma.user.findFirst({
      where: {
        tenantId: currentUser.tenantId,
        email,
        deletedAt: null,
      },
    });

    if (existingUser) {
      throw new ConflictException('An active user with this email already exists.');
    }

    await this.ensureTenantUserLimit(currentUser);

    const user = await this.prisma.user.create({
      data: {
        tenantId: currentUser.tenantId,
        email,
        passwordHash: await hash(TEMPORARY_PASSWORD, 10),
        firstName: input.firstName.trim(),
        lastName: input.lastName.trim(),
        status: UserStatus.ACTIVE,
        roleCode,
      },
    });

    await this.auditService.recordEvent({
      actor: currentUser,
      tenantId: currentUser.tenantId,
      tenantName: currentUser.tenant.name,
      tenantSlug: currentUser.tenant.slug,
      action: 'USER_CREATED',
      resourceType: 'USER',
      resourceId: user.id,
      summary: `Usuario ${user.email} creado con rol ${user.roleCode}.`,
      metadata: {
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        roleCode: user.roleCode,
        status: user.status,
      },
    });

    return user;
  }

  async updateTenantUser(
    currentUser: AuthenticatedUser,
    input: UpdateUserInput,
  ) {
    this.ensureTenantAdmin(currentUser);

    const user = await this.findManageableTenantUser(currentUser, input.userId);
    const roleCode = this.normalizeAllowedRole(input.roleCode);
    const email = input.email.trim().toLowerCase();

    const existingUser = await this.prisma.user.findFirst({
      where: {
        tenantId: currentUser.tenantId,
        email,
        deletedAt: null,
        id: {
          not: user.id,
        },
      },
    });

    if (existingUser) {
      throw new ConflictException('An active user with this email already exists.');
    }

    await this.ensureAdminWillRemainIfRoleChanges(user, roleCode);

    const updatedUser = await this.prisma.user.update({
      where: {
        id: user.id,
      },
      data: {
        email,
        firstName: input.firstName.trim(),
        lastName: input.lastName.trim(),
        roleCode,
      },
    });

    await this.auditService.recordEvent({
      actor: currentUser,
      tenantId: currentUser.tenantId,
      tenantName: currentUser.tenant.name,
      tenantSlug: currentUser.tenant.slug,
      action: 'USER_UPDATED',
      resourceType: 'USER',
      resourceId: updatedUser.id,
      summary: `Usuario ${updatedUser.email} actualizado.`,
      metadata: {
        previous: this.toAuditUserMetadata(user),
        current: this.toAuditUserMetadata(updatedUser),
      },
    });

    return updatedUser;
  }

  async disableTenantUser(currentUser: AuthenticatedUser, userId: string) {
    this.ensureTenantAdmin(currentUser);

    const user = await this.findManageableTenantUser(currentUser, userId);
    if (user.status === UserStatus.DISABLED) {
      return user;
    }

    await this.ensureAdminWillRemainIfDisabled(user);

    const updatedUser = await this.prisma.user.update({
      where: {
        id: user.id,
      },
      data: {
        status: UserStatus.DISABLED,
      },
    });

    await this.auditService.recordEvent({
      actor: currentUser,
      tenantId: currentUser.tenantId,
      tenantName: currentUser.tenant.name,
      tenantSlug: currentUser.tenant.slug,
      action: 'USER_DISABLED',
      resourceType: 'USER',
      resourceId: updatedUser.id,
      summary: `Usuario ${updatedUser.email} desactivado.`,
      metadata: {
        previous: this.toAuditUserMetadata(user),
        current: this.toAuditUserMetadata(updatedUser),
      },
    });

    return updatedUser;
  }

  async reactivateTenantUser(currentUser: AuthenticatedUser, userId: string) {
    this.ensureTenantAdmin(currentUser);

    const user = await this.findManageableTenantUser(currentUser, userId);
    if (user.status === UserStatus.ACTIVE) {
      return user;
    }

    await this.ensureTenantAllowsReactivation(currentUser);

    const updatedUser = await this.prisma.user.update({
      where: {
        id: user.id,
      },
      data: {
        status: UserStatus.ACTIVE,
      },
    });

    await this.auditService.recordEvent({
      actor: currentUser,
      tenantId: currentUser.tenantId,
      tenantName: currentUser.tenant.name,
      tenantSlug: currentUser.tenant.slug,
      action: 'USER_REACTIVATED',
      resourceType: 'USER',
      resourceId: updatedUser.id,
      summary: `Usuario ${updatedUser.email} reactivado.`,
      metadata: {
        previous: this.toAuditUserMetadata(user),
        current: this.toAuditUserMetadata(updatedUser),
      },
    });

    return updatedUser;
  }

  private ensureTenantAdmin(currentUser: AuthenticatedUser) {
    const roleCode = currentUser.roleCode.trim().toUpperCase();
    if (!TENANT_ADMIN_ROLES.includes(roleCode)) {
      throw new ForbiddenException('Only tenant administrators can manage users.');
    }
  }

  private async findManageableTenantUser(
    currentUser: AuthenticatedUser,
    userId: string,
  ) {
    const user = await this.prisma.user.findFirst({
      where: {
        id: userId,
        tenantId: currentUser.tenantId,
        deletedAt: null,
        roleCode: {
          not: 'SUPER_ADMIN',
        },
      },
    });

    if (!user) {
      throw new NotFoundException('User was not found.');
    }

    return user;
  }

  private normalizeAllowedRole(roleCode: string) {
    const normalizedRoleCode = roleCode.trim().toUpperCase();
    if (!ALLOWED_CREATE_ROLES.includes(normalizedRoleCode)) {
      throw new ForbiddenException('Role is not allowed for tenant users.');
    }

    return normalizedRoleCode;
  }

  private async ensureAdminWillRemainIfRoleChanges(
    user: TenantUser,
    newRoleCode: string,
  ) {
    if (
      user.status !== UserStatus.ACTIVE ||
      !this.isTenantAdminRole(user.roleCode) ||
      this.isTenantAdminRole(newRoleCode)
    ) {
      return;
    }

    await this.ensureMoreThanOneActiveAdmin(user.tenantId);
  }

  private async ensureAdminWillRemainIfDisabled(user: TenantUser) {
    if (user.status !== UserStatus.ACTIVE || !this.isTenantAdminRole(user.roleCode)) {
      return;
    }

    await this.ensureMoreThanOneActiveAdmin(user.tenantId);
  }

  private async ensureMoreThanOneActiveAdmin(tenantId: string) {
    const activeAdmins = await this.prisma.user.count({
      where: {
        tenantId,
        status: UserStatus.ACTIVE,
        deletedAt: null,
        roleCode: {
          in: TENANT_ADMIN_ROLES,
        },
      },
    });

    if (activeAdmins <= 1) {
      throw new ForbiddenException(
        'At least one active tenant administrator is required.',
      );
    }
  }

  private isTenantAdminRole(roleCode: string) {
    return TENANT_ADMIN_ROLES.includes(roleCode.trim().toUpperCase());
  }

  private async ensureTenantAllowsReactivation(currentUser: AuthenticatedUser) {
    let subscription: { planCode: string };

    try {
      subscription =
        await this.paymentsIntegration.findCurrentTenantSubscription(currentUser);
    } catch {
      throw new ServiceUnavailableException(
        'Cannot validate plan limits while Payments is unavailable.',
      );
    }

    if (subscription.planCode === 'individual') {
      throw new ForbiddenException(
        'The individual plan does not allow manual user reactivation.',
      );
    }
  }

  private toAuditUserMetadata(user: TenantUser) {
    return {
      id: user.id,
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
      roleCode: user.roleCode,
      status: user.status,
    };
  }

  private async ensureTenantUserLimit(currentUser: AuthenticatedUser) {
    let subscription: { planCode: string };

    try {
      subscription =
        await this.paymentsIntegration.findCurrentTenantSubscription(currentUser);
    } catch {
      throw new ServiceUnavailableException(
        'Cannot validate plan limits while Payments is unavailable.',
      );
    }

    if (subscription.planCode !== 'individual') {
      return;
    }

    const activeUsers = await this.prisma.user.count({
      where: {
        tenantId: currentUser.tenantId,
        status: UserStatus.ACTIVE,
        deletedAt: null,
      },
    });

    if (activeUsers >= 1) {
      throw new ForbiddenException(
        'The individual plan allows only one active user.',
      );
    }
  }
}
