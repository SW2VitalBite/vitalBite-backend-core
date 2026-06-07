import { Field, ID, Int, ObjectType } from '@nestjs/graphql';
import { DietMealItemModel } from './diet-meal-item.model';

@ObjectType('DietMeal')
export class DietMealModel {
  @Field(() => ID)
  id: string;

  @Field(() => ID)
  dietPlanDayId: string;

  @Field()
  name: string;

  @Field(() => Int)
  mealOrder: number;

  @Field(() => Int, { nullable: true })
  targetCalories?: number | null;

  @Field(() => String, { nullable: true })
  notes?: string | null;

  @Field(() => [DietMealItemModel])
  items: DietMealItemModel[];

  @Field()
  createdAt: Date;

  @Field()
  updatedAt: Date;
}
