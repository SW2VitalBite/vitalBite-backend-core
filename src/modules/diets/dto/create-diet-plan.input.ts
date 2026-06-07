import { Field, ID, InputType, Int } from '@nestjs/graphql';
import {
  IsDate,
  IsInt,
  IsOptional,
  IsString,
  IsUUID,
  Max,
  Min,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';
import { DietPlanStatus } from '../../../prisma/generated-client';
import { DietPlanDayInput } from './diet-structure.input';

@InputType()
export class CreateDietPlanInput {
  @Field(() => ID)
  @IsUUID()
  patientId: string;

  @Field(() => ID, { nullable: true })
  @IsOptional()
  @IsUUID()
  nutritionistId?: string;

  @Field()
  @IsString()
  name: string;

  @Field()
  @IsString()
  objective: string;

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

  @Field(() => [DietPlanDayInput], { nullable: true })
  @IsOptional()
  @ValidateNested({ each: true })
  @Type(() => DietPlanDayInput)
  days?: DietPlanDayInput[];
}
