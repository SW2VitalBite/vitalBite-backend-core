import { Field, Float, InputType } from '@nestjs/graphql';
import {
  IsNumber,
  IsOptional,
  IsString,
  Min,
  MinLength,
} from 'class-validator';

@InputType()
export class CreateDietItemInput {
  @Field()
  @IsString()
  @MinLength(1)
  name: string;

  @Field(() => Float)
  @IsNumber()
  @Min(0)
  quantity: number;

  @Field()
  @IsString()
  @MinLength(1)
  unit: string;

  @Field(() => Float, { nullable: true })
  @IsOptional()
  @IsNumber()
  calories?: number;

  @Field(() => Float, { nullable: true })
  @IsOptional()
  @IsNumber()
  protein?: number;

  @Field(() => Float, { nullable: true })
  @IsOptional()
  @IsNumber()
  carbs?: number;

  @Field(() => Float, { nullable: true })
  @IsOptional()
  @IsNumber()
  fat?: number;
}
