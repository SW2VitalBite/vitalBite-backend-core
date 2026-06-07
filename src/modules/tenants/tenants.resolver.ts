import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { TenantStatus } from '../../prisma/generated-client';
import { AuthContextService } from '../auth/auth-context.service';
import { PlanChangeRequestModel } from '../payments/models/plan-change-request.model';
import { ResolveSuperAdminPlanChangeInput } from './dto/resolve-super-admin-plan-change.input';
import { UpdateTenantStatusInput } from './dto/update-tenant-status.input';
import {
  SuperAdminTenantDetailModel,
  SuperAdminTenantOverviewModel,
} from './models/super-admin-tenant-detail.model';
import { TenantModel } from './models/tenant.model';
import { TenantsService } from './tenants.service';

@Resolver(() => TenantModel)
export class TenantsResolver {
  constructor(
    private readonly authContext: AuthContextService,
    private readonly tenantsService: TenantsService,
  ) {}

  @Query(() => TenantModel)
  async currentTenant() {
    const currentUser = await this.authContext.getCurrentUser();
    return currentUser.tenant;
  }

  @Query(() => [SuperAdminTenantOverviewModel])
  async superAdminTenants(
    @Args('search', { nullable: true }) search?: string,
    @Args('status', { type: () => TenantStatus, nullable: true })
    status?: TenantStatus,
  ) {
    const currentUser = await this.authContext.getCurrentUser();
    return this.tenantsService.findGlobalTenants(currentUser, {
      search,
      status,
    });
  }

  @Query(() => SuperAdminTenantDetailModel)
  async superAdminTenantDetail(@Args('tenantId') tenantId: string) {
    const currentUser = await this.authContext.getCurrentUser();
    return this.tenantsService.findGlobalTenantDetail(currentUser, tenantId);
  }

  @Query(() => [PlanChangeRequestModel])
  async superAdminPlanChangeRequests(
    @Args('status', { nullable: true }) status?: string,
    @Args('tenantId', { nullable: true }) tenantId?: string,
  ) {
    const currentUser = await this.authContext.getCurrentUser();
    return this.tenantsService.findGlobalPlanChangeRequests(currentUser, {
      status,
      tenantId,
    });
  }

  @Mutation(() => TenantModel)
  async updateTenantStatus(@Args('input') input: UpdateTenantStatusInput) {
    const currentUser = await this.authContext.getCurrentUser();
    return this.tenantsService.updateTenantStatus(currentUser, input);
  }

  @Mutation(() => PlanChangeRequestModel)
  async resolveSuperAdminPlanChange(
    @Args('input') input: ResolveSuperAdminPlanChangeInput,
  ) {
    const currentUser = await this.authContext.getCurrentUser();
    return this.tenantsService.resolveSuperAdminPlanChange(currentUser, input);
  }
}
