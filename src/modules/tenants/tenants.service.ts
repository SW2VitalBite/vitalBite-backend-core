import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Prisma, TenantStatus } from '../../prisma/generated-client';
import { PrismaService } from '../../prisma/prisma.service';
import { AuditService } from '../audit/audit.service';
import { AuthenticatedUser } from '../auth/auth.types';
import { ResolvePlanChangeInput } from '../payments/dto/resolve-plan-change.input';
import { PlanChangeRequestModel } from '../payments/models/plan-change-request.model';
import { PaymentsIntegrationService } from '../payments/payments-integration.service';
import {
  ResolveSuperAdminPlanChangeInput,
  SuperAdminPlanChangeAction,
} from './dto/resolve-super-admin-plan-change.input';
import { UpdateTenantStatusInput } from './dto/update-tenant-status.input';

const SYSTEM_TENANT_SLUG = 'vitalbite-system';

type TenantWithCounts = Prisma.TenantGetPayload<{
  include: {
    _count: {
      select: {
        users: true;
        patients: true;
      };
    };
  };
}>;

@Injectable()
export class TenantsService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly paymentsIntegration: PaymentsIntegrationService,
    private readonly auditService: AuditService,
  ) {}

  async findGlobalTenants(
    currentUser: AuthenticatedUser,
    filters: { search?: string | null; status?: TenantStatus | null },
  ) {
    this.ensureSuperAdmin(currentUser);
    const tenants = await this.findTenants(filters);
    const [subscriptions, requests] = await Promise.all([
      this.paymentsIntegration.findAllSubscriptions(currentUser),
      this.paymentsIntegration.findAllPlanChangeRequests(currentUser, {
        status: 'PENDING',
      }),
    ]);

    return tenants.map((tenant) => ({
      tenant,
      subscription:
        subscriptions.find((subscription) => subscription.tenantId === tenant.slug) ??
        null,
      pendingPlanChangeRequestsCount: requests.filter(
        (request) => request.tenantId === tenant.slug,
      ).length,
      usersCount: tenant._count.users,
      patientsCount: tenant._count.patients,
    }));
  }

  async findGlobalTenantDetail(
    currentUser: AuthenticatedUser,
    tenantId: string,
  ) {
    this.ensureSuperAdmin(currentUser);
    const tenant = await this.findTenantById(tenantId);
    const [subscriptions, requests] = await Promise.all([
      this.paymentsIntegration.findAllSubscriptions(currentUser),
      this.paymentsIntegration.findAllPlanChangeRequests(currentUser),
    ]);

    return {
      tenant,
      subscription:
        subscriptions.find((subscription) => subscription.tenantId === tenant.slug) ??
        null,
      planChangeRequests: requests.filter(
        (request) => request.tenantId === tenant.slug,
      ),
      usersCount: tenant._count.users,
      patientsCount: tenant._count.patients,
    };
  }

  async findGlobalPlanChangeRequests(
    currentUser: AuthenticatedUser,
    filters: { status?: string | null; tenantId?: string | null },
  ) {
    this.ensureSuperAdmin(currentUser);
    const requests = await this.paymentsIntegration.findAllPlanChangeRequests(
      currentUser,
      { status: filters.status },
    );

    if (!filters.tenantId) {
      return requests;
    }

    const tenant = await this.findTenantById(filters.tenantId);
    return requests.filter((request) => request.tenantId === tenant.slug);
  }

  async updateTenantStatus(
    currentUser: AuthenticatedUser,
    input: UpdateTenantStatusInput,
  ) {
    this.ensureSuperAdmin(currentUser);
    const tenant = await this.findTenantById(input.tenantId);
    if (tenant.slug === SYSTEM_TENANT_SLUG) {
      throw new ForbiddenException('System tenant status cannot be changed.');
    }

    const updatedTenant = await this.prisma.tenant.update({
      where: {
        id: input.tenantId,
      },
      data: {
        status: input.status,
      },
    });

    await this.auditService.recordEvent({
      actor: currentUser,
      tenantId: tenant.id,
      tenantName: tenant.name,
      tenantSlug: tenant.slug,
      action: 'TENANT_STATUS_CHANGED',
      resourceType: 'TENANT',
      resourceId: tenant.id,
      summary: `Tenant ${tenant.slug} cambio de estado ${tenant.status} a ${updatedTenant.status}.`,
      metadata: {
        previousStatus: tenant.status,
        newStatus: updatedTenant.status,
      },
    });

    return updatedTenant;
  }

  async resolveSuperAdminPlanChange(
    currentUser: AuthenticatedUser,
    input: ResolveSuperAdminPlanChangeInput,
  ): Promise<PlanChangeRequestModel> {
    this.ensureSuperAdmin(currentUser);
    const tenant = await this.findTenantById(input.tenantId);
    const action =
      input.action === SuperAdminPlanChangeAction.APPROVE
        ? 'approve'
        : 'reject';

    const request = await this.paymentsIntegration.resolvePlanChangeForTenant(
      currentUser,
      tenant.slug,
      {
        requestId: input.requestId,
        comment: input.comment,
      } satisfies ResolvePlanChangeInput,
      action,
    );

    await this.auditService.recordEvent({
      actor: currentUser,
      tenantId: tenant.id,
      tenantName: tenant.name,
      tenantSlug: tenant.slug,
      action:
        input.action === SuperAdminPlanChangeAction.APPROVE
          ? 'PLAN_CHANGE_APPROVED'
          : 'PLAN_CHANGE_REJECTED',
      resourceType: 'PLAN_CHANGE_REQUEST',
      resourceId: request.requestId,
      summary: `Solicitud de cambio de plan ${request.requestId} ${action === 'approve' ? 'aprobada' : 'rechazada'}.`,
      metadata: {
        currentPlanCode: request.currentPlanCode,
        requestedPlanCode: request.requestedPlanCode,
        requestedPlanName: request.requestedPlanName,
        status: request.status,
        resolutionComment: request.resolutionComment,
        resolvedAt: request.resolvedAt?.toISOString() ?? null,
      },
    });

    return request;
  }

  private async findTenants(filters: {
    search?: string | null;
    status?: TenantStatus | null;
  }) {
    const where: Prisma.TenantWhereInput = {
      deletedAt: null,
      slug: {
        not: SYSTEM_TENANT_SLUG,
      },
    };

    if (filters.status) {
      where.status = filters.status;
    }

    const search = filters.search?.trim();
    if (search) {
      where.OR = [
        { name: { contains: search, mode: 'insensitive' } },
        { slug: { contains: search, mode: 'insensitive' } },
      ];
    }

    return this.prisma.tenant.findMany({
      where,
      include: {
        _count: {
          select: {
            users: { where: { deletedAt: null } },
            patients: { where: { deletedAt: null } },
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
  }

  private async findTenantById(tenantId: string): Promise<TenantWithCounts> {
    const tenant = await this.prisma.tenant.findFirst({
      where: {
        id: tenantId,
        deletedAt: null,
      },
      include: {
        _count: {
          select: {
            users: { where: { deletedAt: null } },
            patients: { where: { deletedAt: null } },
          },
        },
      },
    });

    if (!tenant) {
      throw new NotFoundException('Tenant was not found.');
    }

    return tenant;
  }

  private ensureSuperAdmin(currentUser: AuthenticatedUser) {
    if (currentUser.roleCode.trim().toUpperCase() !== 'SUPER_ADMIN') {
      throw new ForbiddenException('Only super administrators can do this.');
    }
  }
}
