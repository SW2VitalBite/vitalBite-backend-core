import { Field, ID, ObjectType } from '@nestjs/graphql';
import { UserStatus } from '../../../prisma/generated-client';

@ObjectType('User')
export class UserModel {
  @Field(() => ID)
  id: string;

  @Field(() => ID)
  tenantId: string;

  @Field()
  email: string;

  @Field()
  firstName: string;

  @Field()
  lastName: string;

  @Field(() => UserStatus)
  status: UserStatus;

  @Field()
  roleCode: string;

  @Field()
  createdAt: Date;

  @Field()
  updatedAt: Date;
}
