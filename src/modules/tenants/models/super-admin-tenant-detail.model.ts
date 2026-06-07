import { Field, Int, ObjectType } from '@nestjs/graphql';
import { PlanChangeRequestModel } from '../../payments/models/plan-change-request.model';
import { TenantSubscriptionModel } from '../../payments/models/tenant-subscription.model';
import { TenantModel } from './tenant.model';

@ObjectType('SuperAdminTenantOverview')
export class SuperAdminTenantOverviewModel {
  @Field(() => TenantModel)
  tenant: TenantModel;

  @Field(() => TenantSubscriptionModel, { nullable: true })
  subscription?: TenantSubscriptionModel | null;

  @Field(() => Int)
  pendingPlanChangeRequestsCount: number;

  @Field(() => Int)
  usersCount: number;

  @Field(() => Int)
  patientsCount: number;
}

@ObjectType('SuperAdminTenantDetail')
export class SuperAdminTenantDetailModel {
  @Field(() => TenantModel)
  tenant: TenantModel;

  @Field(() => TenantSubscriptionModel, { nullable: true })
  subscription?: TenantSubscriptionModel | null;

  @Field(() => [PlanChangeRequestModel])
  planChangeRequests: PlanChangeRequestModel[];

  @Field(() => Int)
  usersCount: number;

  @Field(() => Int)
  patientsCount: number;
}
