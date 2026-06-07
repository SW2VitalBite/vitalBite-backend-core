import { Field, InputType, Int } from '@nestjs/graphql';
import { IsDate, IsInt, IsOptional, IsString, Max, Min } from 'class-validator';
import { DietPlanStatus } from '../../../prisma/generated-client';

@InputType()
export class UpdateDietPlanInput {
  @Field(() => String, { nullable: true })
  @IsOptional()
  @IsString()
  name?: string;

  @Field(() => String, { nullable: true })
  @IsOptional()
  @IsString()
  objective?: string;

  @Field(() => String, { nullable: true })
  @IsOptional()
  @IsString()
  phase?: string;

  @Field(() => String, { nullable: true })
  @IsOptional()
  @IsString()
  approach?: string;

  @Field(() => Date, { nullable: true })
  @IsOptional()
  @IsDate()
  startDate?: Date;

  @Field(() => Date, { nullable: true })
  @IsOptional()
  @IsDate()
  endDate?: Date;

  @Field(() => DietPlanStatus, { nullable: true })
  @IsOptional()
  status?: DietPlanStatus;

  @Field(() => Int, { nullable: true })
  @IsOptional()
  @IsInt()
  @Min(1)
  mealsPerDay?: number;

  @Field(() => String, { nullable: true })
  @IsOptional()
  @IsString()
  mainRestriction?: string;

  @Field(() => String, { nullable: true })
  @IsOptional()
  @IsString()
  notes?: string;

  @Field(() => Int, { nullable: true })
  @IsOptional()
  @IsInt()
  @Min(0)
  estimatedCalories?: number;

  @Field(() => Int, { nullable: true })
  @IsOptional()
  @IsInt()
  @Min(0)
  @Max(100)
  adherencePercent?: number;
}
