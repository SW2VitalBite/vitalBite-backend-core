import { Field, InputType, Int } from '@nestjs/graphql';

@InputType()
export class SaveScheduleInput {
  @Field(() => Int)
  dayOfWeek: number;

  @Field()
  startTime: string;

  @Field()
  endTime: string;
}
