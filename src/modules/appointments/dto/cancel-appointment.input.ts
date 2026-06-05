import { Field, InputType } from '@nestjs/graphql';
import { IsString, Length } from 'class-validator';

@InputType()
export class CancelAppointmentInput {
  @Field()
  @IsString()
  @Length(1, 300)
  reason: string;
}
