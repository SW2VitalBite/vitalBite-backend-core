import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { AuthContextService } from '../auth/auth-context.service';
import { CreateInitialCheckoutSessionInput } from './dto/create-initial-checkout-session.input';
import { RequestPlanChangeInput } from './dto/request-plan-change.input';
import { ResolvePlanChangeInput } from './dto/resolve-plan-change.input';
import { CheckoutSessionStatusModel } from './models/checkout-session-status.model';
import { InitialCheckoutSessionModel } from './models/initial-checkout-session.model';
import { PlanChangeRequestModel } from './models/plan-change-request.model';
import { PaymentResponseModel } from './models/payment-response.model';
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

  @Query(() => TenantSubscriptionModel, { nullable: true })
  async currentTenantSubscription() {
    const currentUser = await this.authContext.getCurrentUser();
    return this.paymentsIntegration.findCurrentTenantSubscription(currentUser);
  }

  @Query(() => CheckoutSessionStatusModel)
  async checkoutSessionStatus(@Args('sessionId') sessionId: string) {
    const currentUser = await this.authContext.getCurrentUser();
    return this.paymentsIntegration.getCheckoutSessionStatus(
      currentUser,
      sessionId,
    );
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

  @Mutation(() => PaymentResponseModel)
  async paySubscription() {
    const currentUser = await this.authContext.getCurrentUser();
    return this.paymentsIntegration.paySubscription(currentUser);
  }

  @Mutation(() => InitialCheckoutSessionModel)
  async createInitialCheckoutSession(
    @Args('input') input: CreateInitialCheckoutSessionInput,
  ) {
    const currentUser = await this.authContext.getCurrentUser();
    return this.paymentsIntegration.createInitialCheckoutSession(
      currentUser,
      input,
    );
  }
}
