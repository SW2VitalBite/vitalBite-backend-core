import { Field, ObjectType } from '@nestjs/graphql';
import { TenantModel } from '../../tenants/models/tenant.model';
import { UserModel } from '../../users/models/user.model';

@ObjectType()
export class AuthSessionModel {
  @Field()
  accessToken: string;

  @Field(() => UserModel)
  user: UserModel;

  @Field(() => TenantModel)
  tenant: TenantModel;
}
