import { Field, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class InitialCheckoutSessionModel {
  @Field()
  sessionId: string;

  @Field()
  checkoutUrl: string;
}
