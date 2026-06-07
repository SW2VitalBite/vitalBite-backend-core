import { Field, ID, Int, ObjectType } from '@nestjs/graphql';
import { DietMealModel } from './diet-meal.model';

@ObjectType('DietPlanDay')
export class DietPlanDayModel {
  @Field(() => ID)
  id: string;

  @Field(() => ID)
  dietPlanId: string;

  @Field()
  dayLabel: string;

  @Field(() => Int)
  dayOrder: number;

  @Field(() => [DietMealModel])
  meals: DietMealModel[];

  @Field()
  createdAt: Date;

  @Field()
  updatedAt: Date;
}
