import { Field, ObjectType } from '@nestjs/graphql';
import { PlanLimitModel } from './subscription-plan.model';

@ObjectType('TenantSubscription')
export class TenantSubscriptionModel {
  @Field()
  tenantId: string;

  @Field()
  planCode: string;

  @Field()
  planName: string;

  @Field()
  status: string;

  @Field()
  billingPeriod: string;

  @Field()
  startedAt: Date;

  @Field()
  nextReviewAt: Date;

  @Field(() => [PlanLimitModel])
  limits: PlanLimitModel[];
}
