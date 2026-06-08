import { Field, ID, Int, ObjectType } from '@nestjs/graphql';
import {
  AppointmentMode,
  AppointmentStatus,
} from '../../../prisma/generated-client';

@ObjectType('Appointment')
export class AppointmentModel {
  @Field(() => ID)
  id: string;

  @Field(() => ID)
  tenantId: string;

  @Field(() => ID)
  patientId: string;

  @Field(() => ID)
  nutritionistId: string;

  @Field(() => Date)
  scheduledAt: Date;

  @Field(() => Int)
  durationMinutes: number;

  @Field(() => AppointmentStatus)
  status: AppointmentStatus;

  @Field(() => AppointmentMode)
  mode: AppointmentMode;

  @Field(() => String, { nullable: true })
  reason?: string | null;

  @Field(() => String, { nullable: true })
  notes?: string | null;

  @Field(() => String, { nullable: true })
  cancelReason?: string | null;

  @Field()
  patientFullName: string;

  @Field()
  nutritionistFullName: string;

  @Field()
  nutritionistEmail: string;

  @Field()
  createdAt: Date;

  @Field()
  updatedAt: Date;
}
