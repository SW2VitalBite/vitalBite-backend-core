import { Field, InputType } from '@nestjs/graphql';
import { IsDate, IsOptional } from 'class-validator';

@InputType()
export class AnthropometryMeasurementFilterInput {
  @Field(() => Date, { nullable: true })
  @IsOptional()
  @IsDate()
  measuredFrom?: Date;

  @Field(() => Date, { nullable: true })
  @IsOptional()
  @IsDate()
  measuredTo?: Date;
}
