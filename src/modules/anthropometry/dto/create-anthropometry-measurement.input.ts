import { Field, Float, ID, InputType } from '@nestjs/graphql';
import { IsDate, IsNumber, IsOptional, IsUUID, Min } from 'class-validator';
import { IsNotFutureDate } from '../../../common/validators/is-not-future-date.validator';

@InputType()
export class CreateAnthropometryMeasurementInput {
  @Field(() => ID)
  @IsUUID()
  patientId: string;

  @Field(() => ID, { nullable: true })
  @IsOptional()
  @IsUUID()
  bodyMeasurementId?: string | null;

  @Field(() => Date)
  @IsDate()
  @IsNotFutureDate()
  measuredAt: Date;

  @Field(() => Float, { nullable: true })
  @IsOptional()
  @IsNumber()
  @Min(0.1)
  neckCm?: number | null;

  @Field(() => Float, { nullable: true })
  @IsOptional()
  @IsNumber()
  @Min(0.1)
  chestThoraxCm?: number | null;

  @Field(() => Float, { nullable: true })
  @IsOptional()
  @IsNumber()
  @Min(0.1)
  rightArmCm?: number | null;

  @Field(() => Float, { nullable: true })
  @IsOptional()
  @IsNumber()
  @Min(0.1)
  leftArmCm?: number | null;

  @Field(() => Float, { nullable: true })
  @IsOptional()
  @IsNumber()
  @Min(0.1)
  rightForearmCm?: number | null;

  @Field(() => Float, { nullable: true })
  @IsOptional()
  @IsNumber()
  @Min(0.1)
  leftForearmCm?: number | null;

  @Field(() => Float, { nullable: true })
  @IsOptional()
  @IsNumber()
  @Min(0.1)
  waistCm?: number | null;

  @Field(() => Float, { nullable: true })
  @IsOptional()
  @IsNumber()
  @Min(0.1)
  abdomenCm?: number | null;

  @Field(() => Float, { nullable: true })
  @IsOptional()
  @IsNumber()
  @Min(0.1)
  hipCm?: number | null;

  @Field(() => Float, { nullable: true })
  @IsOptional()
  @IsNumber()
  @Min(0.1)
  rightThighCm?: number | null;

  @Field(() => Float, { nullable: true })
  @IsOptional()
  @IsNumber()
  @Min(0.1)
  leftThighCm?: number | null;

  @Field(() => Float, { nullable: true })
  @IsOptional()
  @IsNumber()
  @Min(0.1)
  rightCalfCm?: number | null;

  @Field(() => Float, { nullable: true })
  @IsOptional()
  @IsNumber()
  @Min(0.1)
  leftCalfCm?: number | null;
}
