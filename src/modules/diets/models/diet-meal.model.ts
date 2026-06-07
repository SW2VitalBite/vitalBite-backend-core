import { Field, ID, ObjectType } from '@nestjs/graphql';
import { MealType } from '../../../prisma/generated-client';
import { DietItemModel } from './diet-item.model';

@ObjectType('DietMeal')
export class DietMealModel {
  @Field(() => ID)
  id: string;

  @Field(() => MealType)
  mealType: MealType;

  @Field(() => String, { nullable: true })
  name?: string | null;

  @Field(() => [DietItemModel])
  items: DietItemModel[];
}
