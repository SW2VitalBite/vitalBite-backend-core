import { Field, ID, ObjectType } from '@nestjs/graphql';
import { TenantStatus } from '../../../prisma/generated-client';

@ObjectType('Tenant')
export class TenantModel {
  @Field(() => ID)
  id: string;

  @Field()
  name: string;

  @Field()
  slug: string;

  @Field(() => TenantStatus)
  status: TenantStatus;

  @Field()
  createdAt: Date;

  @Field()
  updatedAt: Date;
}
