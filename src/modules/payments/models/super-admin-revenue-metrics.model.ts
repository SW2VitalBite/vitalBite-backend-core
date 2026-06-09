import { Field, ObjectType, Float, Int } from '@nestjs/graphql';

@ObjectType()
export class RevenueByPlanModel {
  @Field()
  planCode: string;

  @Field()
  planName: string;

  @Field(() => Float)
  mrr: number;

  @Field(() => Int)
  subscriptionsCount: number;
}

@ObjectType()
export class SuperAdminRevenueMetricsModel {
  @Field(() => Float)
  mrr: number;

  @Field(() => Int)
  activeSubscriptions: number;

  @Field(() => [RevenueByPlanModel])
  revenueByPlan: RevenueByPlanModel[];
}
