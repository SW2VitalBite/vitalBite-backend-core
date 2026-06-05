import { Field, ID, InputType, registerEnumType } from '@nestjs/graphql';

export enum SuperAdminPlanChangeAction {
  APPROVE = 'APPROVE',
  REJECT = 'REJECT',
}

registerEnumType(SuperAdminPlanChangeAction, {
  name: 'SuperAdminPlanChangeAction',
});

@InputType()
export class ResolveSuperAdminPlanChangeInput {
  @Field(() => ID)
  tenantId: string;

  @Field()
  requestId: string;

  @Field(() => SuperAdminPlanChangeAction)
  action: SuperAdminPlanChangeAction;

  @Field(() => String, { nullable: true })
  comment?: string | null;
}
