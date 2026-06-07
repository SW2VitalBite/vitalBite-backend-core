import { Field, ID, InputType, Int } from '@nestjs/graphql';
import { IsInt, IsOptional, IsString, IsUUID, Min } from 'class-validator';

@InputType()
export class DuplicateDietPlanDayInput {
  @Field(() => ID)
  @IsUUID()
  dietPlanId: string;

  @Field(() => ID)
  @IsUUID()
  sourceDayId: string;

  @Field(() => String, { nullable: true })
  @IsOptional()
  @IsString()
  targetDayLabel?: string;

  @Field(() => Int, { nullable: true })
  @IsOptional()
  @IsInt()
  @Min(1)
  targetDayOrder?: number;
}
