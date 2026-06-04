import { Field, InputType, Int } from '@nestjs/graphql';
import {
  IsDate,
  IsInt,
  IsOptional,
  IsString,
  Length,
  Min,
} from 'class-validator';

@InputType()
export class RescheduleAppointmentInput {
  @Field(() => Date)
  @IsDate()
  scheduledAt: Date;

  @Field(() => Int)
  @IsInt()
  @Min(1)
  durationMinutes: number;

  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  @Length(1, 200)
  reason?: string;

  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  notes?: string;
}
