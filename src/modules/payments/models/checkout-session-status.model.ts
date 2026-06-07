import { Field, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class CheckoutSessionStatusModel {
  @Field()
  sessionId: string;

  @Field()
  status: string;

  @Field(() => String, { nullable: true })
  planCode?: string | null;

  @Field(() => String, { nullable: true })
  invoiceUrl?: string | null;

  @Field(() => Date, { nullable: true })
  activatedAt?: Date | null;

  @Field(() => Date, { nullable: true })
  nextReviewAt?: Date | null;
}
