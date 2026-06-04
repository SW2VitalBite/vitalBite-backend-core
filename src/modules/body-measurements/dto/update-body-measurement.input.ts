import { Field, InputType, Float } from '@nestjs/graphql';
import { IsDate, IsNumber, IsOptional, Min } from 'class-validator';
import { IsNotFutureDate } from '../../../common/validators/is-not-future-date.validator';

@InputType()
export class UpdateBodyMeasurementInput {
  @Field(() => Date, { nullable: true })
  @IsOptional()
  @IsDate()
  @IsNotFutureDate()
  measuredAt?: Date;

  @Field(() => Float, { nullable: true })
  @IsOptional()
  @IsNumber()
  @Min(0.1)
  weightKg?: number;

  @Field(() => Float, { nullable: true })
  @IsOptional()
  @IsNumber()
  @Min(0.1)
  heightCm?: number;

  @Field(() => Float, { nullable: true })
  @IsOptional()
  @IsNumber()
  @Min(0.1)
  waistCm?: number;

  @Field(() => Float, { nullable: true })
  @IsOptional()
  @IsNumber()
  @Min(0.1)
  hipCm?: number;
}
