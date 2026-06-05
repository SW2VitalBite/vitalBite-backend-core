import { Field, InputType, Int } from '@nestjs/graphql';
import { IsInt, IsOptional, IsString, Min, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';

@InputType()
export class DietMealItemInput {
  @Field()
  @IsString()
  name: string;

  @Field(() => String, { nullable: true })
  @IsOptional()
  @IsString()
  portion?: string;

  @Field(() => Int, { nullable: true })
  @IsOptional()
  @IsInt()
  @Min(0)
  calories?: number;

  @Field(() => Int, { nullable: true })
  @IsOptional()
  @IsInt()
  @Min(1)
  itemOrder?: number;

  @Field(() => String, { nullable: true })
  @IsOptional()
  @IsString()
  notes?: string;
}

@InputType()
export class DietMealInput {
  @Field()
  @IsString()
  name: string;

  @Field(() => Int, { nullable: true })
  @IsOptional()
  @IsInt()
  @Min(1)
  mealOrder?: number;

  @Field(() => Int, { nullable: true })
  @IsOptional()
  @IsInt()
  @Min(0)
  targetCalories?: number;

  @Field(() => String, { nullable: true })
  @IsOptional()
  @IsString()
  notes?: string;

  @Field(() => [DietMealItemInput], { nullable: true })
  @IsOptional()
  @ValidateNested({ each: true })
  @Type(() => DietMealItemInput)
  items?: DietMealItemInput[];
}

@InputType()
export class DietPlanDayInput {
  @Field()
  @IsString()
  dayLabel: string;

  @Field(() => Int, { nullable: true })
  @IsOptional()
  @IsInt()
  @Min(1)
  dayOrder?: number;

  @Field(() => [DietMealInput], { nullable: true })
  @IsOptional()
  @ValidateNested({ each: true })
  @Type(() => DietMealInput)
  meals?: DietMealInput[];
}
