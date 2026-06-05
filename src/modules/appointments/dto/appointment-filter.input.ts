import { Field, ID, InputType } from '@nestjs/graphql';
import { IsDate, IsEnum, IsOptional, IsString, IsUUID } from 'class-validator';
import { AppointmentStatus } from '../../../prisma/generated-client';

@InputType()
export class AppointmentFilterInput {
  @Field(() => ID, { nullable: true })
  @IsOptional()
  @IsUUID()
  patientId?: string;

  @Field(() => ID, { nullable: true })
  @IsOptional()
  @IsUUID()
  nutritionistId?: string;

  @Field(() => AppointmentStatus, { nullable: true })
  @IsOptional()
  @IsEnum(AppointmentStatus)
  status?: AppointmentStatus;

  @Field(() => Date, { nullable: true })
  @IsOptional()
  @IsDate()
  dateFrom?: Date;

  @Field(() => Date, { nullable: true })
  @IsOptional()
  @IsDate()
  dateTo?: Date;

  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  search?: string;
}
