import {
  ForbiddenException,
  Injectable,
  ServiceUnavailableException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { AuthenticatedUser } from '../auth/auth.types';
import { RequestPlanChangeInput } from './dto/request-plan-change.input';
import { ResolvePlanChangeInput } from './dto/resolve-plan-change.input';
import { PlanChangeRequestModel } from './models/plan-change-request.model';
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

@Injectable()
export class PaymentsIntegrationService {
  constructor(private readonly configService: ConfigService) {}

  async findPlans(currentUser: AuthenticatedUser) {
    this.ensureAdmin(currentUser);
    const plans = await this.request<PaymentsPlanResponse[]>('/plans');
    return plans.map((plan) => this.toPlanModel(plan));
  }

  async findCurrentTenantSubscription(currentUser: AuthenticatedUser) {
    this.ensureAdmin(currentUser);
    const tenantSlug = currentUser.tenant.slug;
    const subscription = await this.request<PaymentsSubscriptionResponse>(
      `/tenants/${encodeURIComponent(tenantSlug)}/subscription`,
    );
    return this.toSubscriptionModel(subscription);
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
    return this.toPlanChangeRequestModel(request);
  }

  private ensureAdmin(currentUser: AuthenticatedUser) {
    const roleCode = currentUser.roleCode.trim().toUpperCase();
    if (roleCode !== 'ADMINISTRADOR' && roleCode !== 'ADMIN') {
      throw new ForbiddenException(
        'Only administrators can access subscription information.',
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
    init: { method?: string; body?: string } = {},
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
