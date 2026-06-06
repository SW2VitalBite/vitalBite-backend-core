import { Field, InputType } from '@nestjs/graphql';
import { Type } from 'class-transformer';
import { ValidateNested } from 'class-validator';
import { DietPlanDayInput } from './diet-structure.input';

@InputType()
export class UpdateDietPlanStructureInput {
  @Field(() => [DietPlanDayInput])
  @ValidateNested({ each: true })
  @Type(() => DietPlanDayInput)
  days: DietPlanDayInput[];
}
