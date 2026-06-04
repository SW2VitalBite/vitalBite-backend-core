import { Field, InputType } from '@nestjs/graphql';
import { IsOptional, IsString } from 'class-validator';

@InputType()
export class CompleteAppointmentInput {
  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  notes?: string;
}
