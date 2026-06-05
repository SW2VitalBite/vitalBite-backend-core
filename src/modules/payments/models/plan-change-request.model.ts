import { Field, ID, ObjectType } from '@nestjs/graphql';

@ObjectType('PlanChangeRequest')
export class PlanChangeRequestModel {
  @Field(() => ID)
  requestId: string;

  @Field()
  tenantId: string;

  @Field()
  currentPlanCode: string;

  @Field()
  requestedPlanCode: string;

  @Field()
  requestedPlanName: string;

  @Field()
  status: string;

  @Field(() => String, { nullable: true })
  comment?: string | null;

  @Field()
  requestedAt: Date;

  @Field(() => String, { nullable: true })
  resolutionComment?: string | null;

  @Field(() => Date, { nullable: true })
  resolvedAt?: Date | null;
}
