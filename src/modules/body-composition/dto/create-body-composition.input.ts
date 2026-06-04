import { Field, Float, ID, InputType, Int } from '@nestjs/graphql';
import {
  IsDate,
  IsInt,
  IsNumber,
  IsOptional,
  IsUUID,
  Max,
  Min,
} from 'class-validator';
import { IsNotFutureDate } from '../../../common/validators/is-not-future-date.validator';

@InputType()
export class CreateBodyCompositionInput {
  @Field(() => ID)
  @IsUUID()
  patientId: string;

  @Field(() => ID, { nullable: true })
  @IsOptional()
  @IsUUID()
  bodyMeasurementId?: string;

  @Field(() => Date)
  @IsDate()
  @IsNotFutureDate()
  measuredAt: Date;

  @Field(() => Float, { nullable: true })
  @IsOptional()
  @IsNumber()
  @Min(0)
  @Max(100)
  bodyFatPercentage?: number;

  @Field(() => Float, { nullable: true })
  @IsOptional()
  @IsNumber()
  @Min(0.1)
  muscleMassKg?: number;

  @Field(() => Float, { nullable: true })
  @IsOptional()
  @IsNumber()
  @Min(0)
  @Max(100)
  waterPercentage?: number;

  @Field(() => Float, { nullable: true })
  @IsOptional()
  @IsNumber()
  @Min(0)
  visceralFatLevel?: number;

  @Field(() => Float, { nullable: true })
  @IsOptional()
  @IsNumber()
  @Min(0.1)
  boneMassKg?: number;

  @Field(() => Int, { nullable: true })
  @IsOptional()
  @IsInt()
  @Min(1)
  metabolicAge?: number;
}
