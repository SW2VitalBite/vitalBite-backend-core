import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { AuthContextService } from '../auth/auth-context.service';
import { RequestPlanChangeInput } from './dto/request-plan-change.input';
import { ResolvePlanChangeInput } from './dto/resolve-plan-change.input';
import { PlanChangeRequestModel } from './models/plan-change-request.model';
import { SubscriptionPlanModel } from './models/subscription-plan.model';
import { TenantSubscriptionModel } from './models/tenant-subscription.model';
import { PaymentsIntegrationService } from './payments-integration.service';

@Resolver()
export class PaymentsResolver {
  constructor(
    private readonly authContext: AuthContextService,
    private readonly paymentsIntegration: PaymentsIntegrationService,
  ) {}

  @Query(() => [SubscriptionPlanModel])
  async subscriptionPlans() {
    const currentUser = await this.authContext.getCurrentUser();
    return this.paymentsIntegration.findPlans(currentUser);
  }

  @Query(() => TenantSubscriptionModel)
  async currentTenantSubscription() {
    const currentUser = await this.authContext.getCurrentUser();
    return this.paymentsIntegration.findCurrentTenantSubscription(currentUser);
  }

  @Query(() => [PlanChangeRequestModel])
  async planChangeRequests() {
    const currentUser = await this.authContext.getCurrentUser();
    return this.paymentsIntegration.findPlanChangeRequests(currentUser);
  }

  @Mutation(() => PlanChangeRequestModel)
  async requestPlanChange(@Args('input') input: RequestPlanChangeInput) {
    const currentUser = await this.authContext.getCurrentUser();
    return this.paymentsIntegration.requestPlanChange(currentUser, input);
  }

  @Mutation(() => PlanChangeRequestModel)
  async approvePlanChange(@Args('input') input: ResolvePlanChangeInput) {
    const currentUser = await this.authContext.getCurrentUser();
    return this.paymentsIntegration.approvePlanChange(currentUser, input);
  }

  @Mutation(() => PlanChangeRequestModel)
  async rejectPlanChange(@Args('input') input: ResolvePlanChangeInput) {
    const currentUser = await this.authContext.getCurrentUser();
    return this.paymentsIntegration.rejectPlanChange(currentUser, input);
  }
}
