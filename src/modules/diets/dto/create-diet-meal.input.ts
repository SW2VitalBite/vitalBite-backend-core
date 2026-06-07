import { Field, InputType } from '@nestjs/graphql';
import {
  IsArray,
  IsEnum,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';
import { MealType } from '../../../prisma/generated-client';
import { CreateDietItemInput } from './create-diet-item.input';

@InputType()
export class CreateDietMealInput {
  @Field(() => MealType)
  @IsEnum(MealType)
  mealType: MealType;

  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  name?: string;

  @Field(() => [CreateDietItemInput])
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateDietItemInput)
  items: CreateDietItemInput[];
}
