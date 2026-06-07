import { Field, ID, InputType } from '@nestjs/graphql';
import { TenantStatus } from '../../../prisma/generated-client';

@InputType()
export class UpdateTenantStatusInput {
  @Field(() => ID)
  tenantId: string;

  @Field(() => TenantStatus)
  status: TenantStatus;
}
