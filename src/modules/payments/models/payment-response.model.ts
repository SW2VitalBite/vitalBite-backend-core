import { Field, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class PaymentResponseModel {
  @Field()
  transactionHash: string;

  @Field()
  invoiceUrl: string;

  @Field()
  nextReviewAt: Date;
}
