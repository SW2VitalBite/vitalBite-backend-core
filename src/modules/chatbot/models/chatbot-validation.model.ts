import { Field, ObjectType } from '@nestjs/graphql';

@ObjectType('ChatbotAvailableSlot')
export class ChatbotAvailableSlotModel {
  @Field()
  id: string; // e.g., 'slot_2026-06-10_09:00'

  @Field()
  date: string;

  @Field()
  startTime: string;

  @Field()
  endTime: string;
}

@ObjectType('ChatbotValidationResponse')
export class ChatbotValidationResponseModel {
  @Field()
  exists: boolean;

  @Field({ nullable: true })
  patientId?: string;

  @Field({ nullable: true })
  patientName?: string;

  @Field({ nullable: true })
  nutritionistId?: string;

  @Field({ nullable: true })
  nutritionistName?: string;

  @Field(() => [ChatbotAvailableSlotModel], { nullable: 'itemsAndList' })
  availableSlots?: ChatbotAvailableSlotModel[];
}
