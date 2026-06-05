import { Field, Float, ObjectType } from '@nestjs/graphql';

@ObjectType('PlanLimit')
export class PlanLimitModel {
  @Field()
  key: string;

  @Field()
  value: string;
}

@ObjectType('SubscriptionPlan')
export class SubscriptionPlanModel {
  @Field()
  code: string;

  @Field()
  name: string;

  @Field()
  description: string;

  @Field(() => Float)
  priceUsd: number;

  @Field()
  billingPeriod: string;

  @Field()
  audience: string;

  @Field(() => [String])
  included: string[];

  @Field(() => [PlanLimitModel])
  limits: PlanLimitModel[];
}
