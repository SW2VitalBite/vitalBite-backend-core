import { Field, ID, InputType } from '@nestjs/graphql';
import { IsOptional, IsString, IsUUID } from 'class-validator';
import { DietPlanStatus } from '../../../prisma/generated-client';

@InputType()
export class DietFilterInput {
  @Field(() => ID, { nullable: true })
  @IsOptional()
  @IsUUID()
  patientId?: string;

  @Field(() => ID, { nullable: true })
  @IsOptional()
  @IsUUID()
  nutritionistId?: string;

  @Field(() => DietPlanStatus, { nullable: true })
  @IsOptional()
  status?: DietPlanStatus;

  @Field(() => String, { nullable: true })
  @IsOptional()
  @IsString()
  search?: string;
}
