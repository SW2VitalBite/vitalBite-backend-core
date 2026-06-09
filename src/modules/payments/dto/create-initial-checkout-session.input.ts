import { Field, InputType } from '@nestjs/graphql';
import { IsString, MinLength } from 'class-validator';

@InputType()
export class CreateInitialCheckoutSessionInput {
  @Field()
  @IsString()
  @MinLength(1)
  planCode: string;
}
