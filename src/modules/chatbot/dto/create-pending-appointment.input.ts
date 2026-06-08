import { Field, InputType } from '@nestjs/graphql';

@InputType()
export class CreatePendingAppointmentInput {
  @Field()
  patientPhone: string;

  @Field()
  slotId: string; // The ID chosen from the WhatsApp list
}
