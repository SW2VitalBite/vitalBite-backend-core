import { Field, ID, InputType } from '@nestjs/graphql';
import {
  IsArray,
  IsDate,
  IsOptional,
  IsString,
  IsUUID,
  MinLength,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';
import { CreateDietMealInput } from './create-diet-meal.input';

@InputType()
export class CreateDietInput {
  @Field(() => ID)
  @IsUUID()
  patientId: string;

  @Field(() => ID, { nullable: true })
  @IsOptional()
  @IsUUID()
  appointmentId?: string;

  @Field()
  @IsString()
  @MinLength(2)
  name: string;

  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  objective?: string;

  @Field()
  @IsDate()
  @Type(() => Date)
  startDate: Date;

  @Field(() => Date, { nullable: true })
  @IsOptional()
  @IsDate()
  @Type(() => Date)
  endDate?: Date;

  @Field(() => [CreateDietMealInput])
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateDietMealInput)
  meals: CreateDietMealInput[];
}
