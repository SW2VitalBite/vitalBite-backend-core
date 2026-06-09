import { Field, InputType } from '@nestjs/graphql';
import { IsNotEmpty, IsString } from 'class-validator';

@InputType()
export class CreatePendingAppointmentInput {
  @Field()
  @IsString()
  @IsNotEmpty()
  patientPhone: string;

  @Field()
  @IsString()
  @IsNotEmpty()
  slotId: string; // The ID chosen from the WhatsApp list
}
