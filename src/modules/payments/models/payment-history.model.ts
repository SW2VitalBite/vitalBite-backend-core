import { Field, ObjectType } from '@nestjs/graphql';

@ObjectType('PaymentHistory')
export class PaymentHistoryModel {
  @Field()
  recordId: string;

  @Field()
  tenantId: string;

  @Field()
  kind: string;

  @Field()
  planCode: string;

  @Field()
  planName: string;

  @Field()
  status: string;

  @Field()
  amountUsd: number;

  @Field(() => String, { nullable: true })
  transactionHash?: string | null;

  @Field(() => String, { nullable: true })
  invoiceUrl?: string | null;

  @Field()
  invoiceStatus: string;

  @Field(() => String, { nullable: true })
  invoiceError?: string | null;

  @Field()
  createdAt: Date;

  @Field(() => Date, { nullable: true })
  activatedAt?: Date | null;

  @Field(() => Date, { nullable: true })
  nextReviewAt?: Date | null;

  @Field(() => String, { nullable: true })
  checkoutSessionId?: string | null;

  @Field(() => String, { nullable: true })
  stripeSubscriptionId?: string | null;
}
