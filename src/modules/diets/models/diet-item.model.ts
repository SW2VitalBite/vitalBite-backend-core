import { Field, Float, ID, ObjectType } from '@nestjs/graphql';

@ObjectType('DietItem')
export class DietItemModel {
  @Field(() => ID)
  id: string;

  @Field()
  name: string;

  @Field(() => Float)
  quantity: number;

  @Field()
  unit: string;

  @Field(() => Float, { nullable: true })
  calories?: number | null;

  @Field(() => Float, { nullable: true })
  protein?: number | null;

  @Field(() => Float, { nullable: true })
  carbs?: number | null;

  @Field(() => Float, { nullable: true })
  fat?: number | null;
}
