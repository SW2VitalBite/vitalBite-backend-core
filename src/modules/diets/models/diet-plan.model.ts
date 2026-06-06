import { Field, ID, Int, ObjectType } from '@nestjs/graphql';
import { DietPlanStatus } from '../../../prisma/generated-client';
import { DietPlanDayModel } from './diet-plan-day.model';

@ObjectType('DietPlan')
export class DietPlanModel {
  @Field(() => ID)
  id: string;

  @Field(() => ID)
  tenantId: string;

  @Field(() => ID)
  patientId: string;

  @Field(() => ID)
  nutritionistId: string;

  @Field()
  name: string;

  @Field()
  objective: string;

  @Field(() => String, { nullable: true })
  phase?: string | null;

  @Field(() => String, { nullable: true })
  approach?: string | null;

  @Field(() => Date, { nullable: true })
  startDate?: Date | null;

  @Field(() => Date, { nullable: true })
  endDate?: Date | null;

  @Field(() => DietPlanStatus)
  status: DietPlanStatus;

  @Field(() => Int, { nullable: true })
  mealsPerDay?: number | null;

  @Field(() => String, { nullable: true })
  mainRestriction?: string | null;

  @Field(() => String, { nullable: true })
  notes?: string | null;

  @Field(() => Int, { nullable: true })
  estimatedCalories?: number | null;

  @Field(() => Int, { nullable: true })
  adherencePercent?: number | null;

  @Field()
  patientFullName: string;

  @Field()
  nutritionistFullName: string;

  @Field(() => [DietPlanDayModel])
  days: DietPlanDayModel[];

  @Field()
  createdAt: Date;

  @Field()
  updatedAt: Date;
}
