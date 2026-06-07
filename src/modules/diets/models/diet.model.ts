import { Field, ID, ObjectType } from '@nestjs/graphql';
import { DietMealModel } from './diet-meal.model';

@ObjectType('Diet')
export class DietModel {
  @Field(() => ID)
  id: string;

  @Field(() => ID)
  tenantId: string;

  @Field(() => ID)
  patientId: string;

  @Field(() => ID)
  nutritionistId: string;

  @Field(() => ID, { nullable: true })
  appointmentId?: string | null;

  @Field()
  name: string;

  @Field(() => String, { nullable: true })
  objective?: string | null;

  @Field()
  startDate: Date;

  @Field(() => Date, { nullable: true })
  endDate?: Date | null;

  @Field()
  isActive: boolean;

  @Field(() => String, { nullable: true })
  pdfUrl?: string | null;

  @Field(() => [DietMealModel])
  meals: DietMealModel[];

  @Field()
  createdAt: Date;

  @Field()
  updatedAt: Date;
}
