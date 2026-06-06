import { Field, ID, Int, ObjectType } from '@nestjs/graphql';

@ObjectType('DietMealItem')
export class DietMealItemModel {
  @Field(() => ID)
  id: string;

  @Field(() => ID)
  dietMealId: string;

  @Field()
  name: string;

  @Field(() => String, { nullable: true })
  portion?: string | null;

  @Field(() => Int, { nullable: true })
  calories?: number | null;

  @Field(() => Int)
  itemOrder: number;

  @Field(() => String, { nullable: true })
  notes?: string | null;

  @Field()
  createdAt: Date;

  @Field()
  updatedAt: Date;
}
