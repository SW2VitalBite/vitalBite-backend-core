import { Field, ID, InputType, Int } from '@nestjs/graphql';
import {
  IsDate,
  IsEnum,
  IsInt,
  IsOptional,
  IsString,
  IsUUID,
  Length,
  Min,
} from 'class-validator';
import {
  AppointmentMode,
  AppointmentStatus,
} from '../../../prisma/generated-client';

@InputType()
export class CreateAppointmentInput {
  @Field(() => ID)
  @IsUUID()
  patientId: string;

  @Field(() => ID)
  @IsUUID()
  nutritionistId: string;

  @Field(() => Date)
  @IsDate()
  scheduledAt: Date;

  @Field(() => Int)
  @IsInt()
  @Min(1)
  durationMinutes: number;

  @Field(() => AppointmentMode, { nullable: true })
  @IsOptional()
  @IsEnum(AppointmentMode)
  mode?: AppointmentMode;

  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  @Length(1, 200)
  reason?: string;

  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  notes?: string;

  @Field(() => AppointmentStatus, { nullable: true })
  @IsOptional()
  @IsEnum(AppointmentStatus)
  status?: AppointmentStatus;
}
