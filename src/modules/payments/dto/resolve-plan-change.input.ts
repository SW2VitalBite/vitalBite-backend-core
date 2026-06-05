import { Field, ID, InputType } from '@nestjs/graphql';
import { IsOptional, IsString, MaxLength, MinLength } from 'class-validator';

@InputType()
export class ResolvePlanChangeInput {
  @Field(() => ID)
  @IsString()
  @MinLength(1)
  requestId: string;

  @Field(() => String, { nullable: true })
  @IsOptional()
  @IsString()
  @MaxLength(500)
  comment?: string | null;
}
