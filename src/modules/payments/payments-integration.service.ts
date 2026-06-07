import {
  ForbiddenException,
  Injectable,
  ServiceUnavailableException,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Prisma } from '../../prisma/generated-client';
import { PrismaService } from '../../prisma/prisma.service';
import { AuditService } from '../audit/audit.service';
import { AuthenticatedUser } from '../auth/auth.types';
import { CreateInitialCheckoutSessionInput } from './dto/create-initial-checkout-session.input';
import { RequestPlanChangeInput } from './dto/request-plan-change.input';
import { ResolvePlanChangeInput } from './dto/resolve-plan-change.input';
import { CheckoutSessionStatusModel } from './models/checkout-session-status.model';
import { InitialCheckoutSessionModel } from './models/initial-checkout-session.model';
import { PlanChangeRequestModel } from './models/plan-change-request.model';
import { PaymentResponseModel } from './models/payment-response.model';
import { SubscriptionPlanModel } from './models/subscription-plan.model';
import { TenantSubscriptionModel } from './models/tenant-subscription.model';

interface PaymentsPlanResponse {
  code: string;
  name: string;
  description: string;
  priceUsd: number;
  billingPeriod: string;
  audience: string;
  included: string[];
  limits: Record<string, string>;
}

interface PaymentsSubscriptionResponse {
  tenantId: string;
  planCode: string;
  planName: string;
  status: string;
  billingPeriod: string;
  startedAt: string;
  nextReviewAt: string;
  limits: Record<string, string>;
}

interface PaymentsPlanChangeRequestResponse {
  requestId: string;
  tenantId: string;
  currentPlanCode: string;
  requestedPlanCode: string;
  requestedPlanName: string;
  status: string;
  comment?: string | null;
  requestedAt: string;
  resolutionComment?: string | null;
  resolvedAt?: string | null;
}

interface PaymentsPayResponse {
  transactionHash: string;
  invoiceUrl: string;
  nextReviewAt: string;
}

interface PaymentsInitialCheckoutSessionResponse {
  sessionId: string;
  checkoutUrl: string;
}

interface PaymentsCheckoutSessionStatusResponse {
  sessionId: string;
  status: string;
  tenantId: string;
  planCode?: string | null;
  invoiceUrl?: string | null;
  activatedAt?: string | null;
  nextReviewAt?: string | null;
}

interface PaymentsRequestOptions {
  method?: string;
  body?: string;
}

@Injectable()
export class PaymentsIntegrationService {
  constructor(
    private readonly configService: ConfigService,
    private readonly auditService: AuditService,
    private readonly prisma: PrismaService,
  ) {}

  async findPlans(currentUser: AuthenticatedUser) {
    this.ensureTenantBillingAccess(currentUser);
    const plans = await this.request<PaymentsPlanResponse[]>('/plans');
    return plans.map((plan) => this.toPlanModel(plan));
  }

  async findCurrentTenantSubscription(currentUser: AuthenticatedUser) {
    this.ensureTenantBillingAccess(currentUser);
    const tenantSlug = currentUser.tenant.slug;
    const subscription = await this.requestOptional<PaymentsSubscriptionResponse>(
      `/tenants/${encodeURIComponent(tenantSlug)}/subscription`,
    );
    return subscription ? this.toSubscriptionModel(subscription) : null;
  }

  async findPlanChangeRequests(currentUser: AuthenticatedUser) {
    this.ensureAdmin(currentUser);
    const tenantSlug = currentUser.tenant.slug;
    const requests = await this.request<PaymentsPlanChangeRequestResponse[]>(
      `/tenants/${encodeURIComponent(tenantSlug)}/plan-change-requests`,
    );
    return requests.map((request) => this.toPlanChangeRequestModel(request));
  }

  async findAllSubscriptions(currentUser: AuthenticatedUser) {
    this.ensureSuperAdmin(currentUser);
    const subscriptions = await this.request<PaymentsSubscriptionResponse[]>(
      '/admin/subscriptions',
    );
    return subscriptions.map((subscription) =>
      this.toSubscriptionModel(subscription),
    );
  }

  async findAllPlanChangeRequests(
    currentUser: AuthenticatedUser,
    filters: { status?: string | null } = {},
  ) {
    this.ensureSuperAdmin(currentUser);
    const params = new URLSearchParams();
    if (filters.status) {
      params.set('status', filters.status);
    }

    const path = params.size
      ? `/admin/plan-change-requests?${params.toString()}`
      : '/admin/plan-change-requests';
    const requests =
      await this.request<PaymentsPlanChangeRequestResponse[]>(path);
    return requests.map((request) => this.toPlanChangeRequestModel(request));
  }

  async requestPlanChange(
    currentUser: AuthenticatedUser,
    input: RequestPlanChangeInput,
  ) {
    this.ensureAdmin(currentUser);
    const tenantSlug = currentUser.tenant.slug;
    const request = await this.request<PaymentsPlanChangeRequestResponse>(
      `/tenants/${encodeURIComponent(tenantSlug)}/plan-change-requests`,
      {
        method: 'POST',
        body: JSON.stringify({
          planCode: input.planCode,
          comment: input.comment,
        }),
      },
    );
    return this.toPlanChangeRequestModel(request);
  }

  async paySubscription(
    currentUser: AuthenticatedUser,
  ): Promise<PaymentResponseModel> {
    this.ensureAdmin(currentUser);
    const tenantSlug = currentUser.tenant.slug;
    const result = await this.request<PaymentsPayResponse>(
      `/tenants/${encodeURIComponent(tenantSlug)}/payments/pay`,
      { method: 'POST', body: '{}' },
    );

    await this.auditService.recordEvent({
      actor: currentUser,
      tenantId: currentUser.tenantId,
      tenantName: currentUser.tenant.name,
      tenantSlug: currentUser.tenant.slug,
      action: 'PAYMENT_PROCESSED',
      resourceType: 'PAYMENT',
      resourceId: result.transactionHash,
      summary: `Pago de suscripción procesado. Hash: ${result.transactionHash}.`,
      metadata: {
        transactionHash: result.transactionHash,
        invoiceUrl: result.invoiceUrl,
        nextReviewAt: result.nextReviewAt,
      },
    });

    return {
      transactionHash: result.transactionHash,
      invoiceUrl: result.invoiceUrl,
      nextReviewAt: new Date(result.nextReviewAt),
    };
  }

  async createInitialCheckoutSession(
    currentUser: AuthenticatedUser,
    input: CreateInitialCheckoutSessionInput,
  ): Promise<InitialCheckoutSessionModel> {
    this.ensureTenantBillingAccess(currentUser);
    await this.ensureTenantHasNoSubscription(currentUser);

    const tenantSlug = currentUser.tenant.slug;
    const result = await this.request<PaymentsInitialCheckoutSessionResponse>(
      `/tenants/${encodeURIComponent(tenantSlug)}/checkout-sessions`,
      {
        method: 'POST',
        body: JSON.stringify({
          planCode: input.planCode,
        }),
      },
    );

    await this.auditService.recordEvent({
      actor: currentUser,
      tenantId: currentUser.tenantId,
      tenantName: currentUser.tenant.name,
      tenantSlug: currentUser.tenant.slug,
      action: 'INITIAL_CHECKOUT_STARTED',
      resourceType: 'CHECKOUT_SESSION',
      resourceId: result.sessionId,
      summary: `Inicio de compra inicial del plan ${input.planCode}.`,
      metadata: {
        sessionId: result.sessionId,
        planCode: input.planCode,
        checkoutUrl: result.checkoutUrl,
      },
    });

    return result;
  }

  async getCheckoutSessionStatus(
    currentUser: AuthenticatedUser,
    sessionId: string,
  ): Promise<CheckoutSessionStatusModel> {
    this.ensureTenantBillingAccess(currentUser);
    const result = await this.request<PaymentsCheckoutSessionStatusResponse>(
      `/checkout-sessions/${encodeURIComponent(sessionId)}`,
    );

    if (result.tenantId !== currentUser.tenant.slug) {
      throw new UnauthorizedException(
        'Checkout session does not belong to the current tenant.',
      );
    }

    if (result.status === 'ACTIVE') {
      await this.recordUniqueAuditEvent(currentUser, {
        action: 'INITIAL_SUBSCRIPTION_ACTIVATED',
        resourceType: 'CHECKOUT_SESSION',
        resourceId: result.sessionId,
        summary: `Suscripción inicial activada para el plan ${result.planCode ?? 'N/A'}.`,
        metadata: {
          sessionId: result.sessionId,
          planCode: result.planCode,
          invoiceUrl: result.invoiceUrl,
          activatedAt: result.activatedAt,
          nextReviewAt: result.nextReviewAt,
        },
      });
    }

    if (result.status === 'CANCELED') {
      await this.recordUniqueAuditEvent(currentUser, {
        action: 'INITIAL_CHECKOUT_CANCELED',
        resourceType: 'CHECKOUT_SESSION',
        resourceId: result.sessionId,
        summary: 'La compra inicial fue cancelada antes de activarse.',
        metadata: {
          sessionId: result.sessionId,
          planCode: result.planCode,
        },
      });
    }

    return {
      sessionId: result.sessionId,
      status: result.status,
      planCode: result.planCode ?? null,
      invoiceUrl: result.invoiceUrl ?? null,
      activatedAt: result.activatedAt ? new Date(result.activatedAt) : null,
      nextReviewAt: result.nextReviewAt ? new Date(result.nextReviewAt) : null,
    };
  }

  async approvePlanChange(
    currentUser: AuthenticatedUser,
    input: ResolvePlanChangeInput,
  ) {
    this.rejectTenantLocalResolution(currentUser, input);
  }

  async rejectPlanChange(
    currentUser: AuthenticatedUser,
    input: ResolvePlanChangeInput,
  ) {
    this.rejectTenantLocalResolution(currentUser, input);
  }

  async resolvePlanChangeForTenant(
    currentUser: AuthenticatedUser,
    tenantSlug: string,
    input: ResolvePlanChangeInput,
    action: 'approve' | 'reject',
  ) {
    this.ensureSuperAdmin(currentUser);
    const request = await this.request<PaymentsPlanChangeRequestResponse>(
      `/tenants/${encodeURIComponent(tenantSlug)}/plan-change-requests/${encodeURIComponent(input.requestId)}/${action}`,
      {
        method: 'POST',
        body: JSON.stringify({
          comment: input.comment,
        }),
      },
    );
    const model = this.toPlanChangeRequestModel(request);
    const actionEvent =
      action === 'approve' ? 'PLAN_CHANGE_APPROVED' : 'PLAN_CHANGE_REJECTED';

    await this.auditService.recordEvent({
      actor: currentUser,
      tenantId: currentUser.tenantId,
      tenantName: currentUser.tenant.name,
      tenantSlug: currentUser.tenant.slug,
      action: actionEvent,
      resourceType: 'PLAN_CHANGE_REQUEST',
      resourceId: model.requestId,
      summary: `Cambio de plan ${action === 'approve' ? 'aprobado' : 'rechazado'} de ${model.currentPlanCode} a ${model.requestedPlanCode}.`,
      metadata: {
        currentPlanCode: model.currentPlanCode,
        requestedPlanCode: model.requestedPlanCode,
        requestedPlanName: model.requestedPlanName,
        status: model.status,
        comment: model.comment,
        requestedAt: model.requestedAt.toISOString(),
      },
    });

    return model;
  }

  private ensureAdmin(currentUser: AuthenticatedUser) {
    const roleCode = currentUser.roleCode.trim().toUpperCase();
    if (roleCode !== 'ADMINISTRADOR' && roleCode !== 'ADMIN') {
      throw new ForbiddenException(
        'Only administrators can access subscription information.',
      );
    }
  }

  private ensureTenantBillingAccess(currentUser: AuthenticatedUser) {
    const roleCode = currentUser.roleCode.trim().toUpperCase();
    if (
      roleCode !== 'ADMINISTRADOR' &&
      roleCode !== 'ADMIN' &&
      roleCode !== 'NUTRICIONISTA'
    ) {
      throw new ForbiddenException(
        'Only tenant staff can access subscription information.',
      );
    }
  }

  private ensureSuperAdmin(currentUser: AuthenticatedUser) {
    const roleCode = currentUser.roleCode.trim().toUpperCase();
    if (roleCode !== 'SUPER_ADMIN') {
      throw new ForbiddenException(
        'Only super administrators can access global subscription information.',
      );
    }
  }

  private async request<T>(
    path: string,
    init: PaymentsRequestOptions = {},
  ): Promise<T> {
    const baseUrl = this.configService.get<string>('paymentsServiceUrl');
    if (!baseUrl) {
      throw new ServiceUnavailableException('PAYMENTS_SERVICE_URL is not set.');
    }

    const url = `${baseUrl.replace(/\/$/, '')}${path}`;
    let response: Response;

    try {
      response = await fetch(url, {
        method: init.method ?? 'GET',
        headers: init.body
          ? {
              'Content-Type': 'application/json',
            }
          : undefined,
        body: init.body,
      });
    } catch {
      throw new ServiceUnavailableException(
        'Payments service is not available.',
      );
    }

    if (!response.ok) {
      throw new ServiceUnavailableException(
        'Payments service returned an invalid response.',
      );
    }

    return (await response.json()) as T;
  }

  private async requestOptional<T>(
    path: string,
    init: PaymentsRequestOptions = {},
  ): Promise<T | null> {
    const baseUrl = this.configService.get<string>('paymentsServiceUrl');
    if (!baseUrl) {
      throw new ServiceUnavailableException('PAYMENTS_SERVICE_URL is not set.');
    }

    const url = `${baseUrl.replace(/\/$/, '')}${path}`;
    let response: Response;

    try {
      response = await fetch(url, {
        method: init.method ?? 'GET',
        headers: init.body
          ? {
              'Content-Type': 'application/json',
            }
          : undefined,
        body: init.body,
      });
    } catch {
      throw new ServiceUnavailableException(
        'Payments service is not available.',
      );
    }

    if (response.status === 404) {
      return null;
    }

    if (!response.ok) {
      throw new ServiceUnavailableException(
        'Payments service returned an invalid response.',
      );
    }

    return (await response.json()) as T;
  }

  private async ensureTenantHasNoSubscription(currentUser: AuthenticatedUser) {
    const currentSubscription =
      await this.findCurrentTenantSubscription(currentUser);
    if (currentSubscription) {
      throw new ForbiddenException(
        'The tenant already has an active subscription.',
      );
    }
  }

  private async recordUniqueAuditEvent(
    currentUser: AuthenticatedUser,
    input: {
      action: string;
      resourceType: string;
      resourceId: string;
      summary: string;
      metadata?: Prisma.InputJsonValue | null;
    },
  ) {
    const existing = await this.prisma.auditEvent.findFirst({
      where: {
        tenantId: currentUser.tenantId,
        action: input.action,
        resourceType: input.resourceType,
        resourceId: input.resourceId,
      },
      select: {
        id: true,
      },
    });

    if (existing) {
      return existing;
    }

    return this.auditService.recordEvent({
      actor: currentUser,
      tenantId: currentUser.tenantId,
      tenantName: currentUser.tenant.name,
      tenantSlug: currentUser.tenant.slug,
      action: input.action,
      resourceType: input.resourceType,
      resourceId: input.resourceId,
      summary: input.summary,
      metadata: input.metadata ?? null,
    });
  }

  private async resolvePlanChange(
    currentUser: AuthenticatedUser,
    input: ResolvePlanChangeInput,
    action: 'approve' | 'reject',
  ) {
    this.ensureAdmin(currentUser);
    const tenantSlug = currentUser.tenant.slug;
    const request = await this.request<PaymentsPlanChangeRequestResponse>(
      `/tenants/${encodeURIComponent(tenantSlug)}/plan-change-requests/${encodeURIComponent(input.requestId)}/${action}`,
      {
        method: 'POST',
        body: JSON.stringify({
          comment: input.comment,
        }),
      },
    );
    return this.toPlanChangeRequestModel(request);
  }

  private rejectTenantLocalResolution(
    currentUser: AuthenticatedUser,
    _input: ResolvePlanChangeInput,
  ): never {
    this.ensureAdmin(currentUser);
    throw new ForbiddenException(
      'Plan change requests must be resolved by a super administrator.',
    );
  }

  private toPlanModel(plan: PaymentsPlanResponse): SubscriptionPlanModel {
    return {
      ...plan,
      limits: this.toLimits(plan.limits),
    };
  }

  private toSubscriptionModel(
    subscription: PaymentsSubscriptionResponse,
  ): TenantSubscriptionModel {
    return {
      ...subscription,
      startedAt: new Date(subscription.startedAt),
      nextReviewAt: new Date(subscription.nextReviewAt),
      limits: this.toLimits(subscription.limits),
    };
  }

  private toPlanChangeRequestModel(
    request: PaymentsPlanChangeRequestResponse,
  ): PlanChangeRequestModel {
    return {
      ...request,
      comment: request.comment || null,
      requestedAt: new Date(request.requestedAt),
      resolutionComment: request.resolutionComment || null,
      resolvedAt: request.resolvedAt ? new Date(request.resolvedAt) : null,
    };
  }

  private toLimits(limits: Record<string, string>) {
    return Object.entries(limits).map(([key, value]) => ({ key, value }));
  }
}
