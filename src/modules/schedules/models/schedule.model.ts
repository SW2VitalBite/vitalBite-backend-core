import { Field, ID, Int, ObjectType } from '@nestjs/graphql';

@ObjectType('NutritionistSchedule')
export class ScheduleModel {
  @Field(() => ID)
  id: string;

  @Field(() => Int)
  dayOfWeek: number;

  @Field()
  startTime: string;

  @Field()
  endTime: string;

  @Field()
  isAvailable: boolean;
}
