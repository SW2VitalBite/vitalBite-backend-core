import { Field, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class PaymentResponseModel {
  @Field()
  transactionHash: string;

  @Field(() => String, { nullable: true })
  invoiceUrl?: string | null;

  @Field()
  invoiceStatus: string;

  @Field(() => String, { nullable: true })
  invoiceError?: string | null;

  @Field()
  nextReviewAt: Date;
}
