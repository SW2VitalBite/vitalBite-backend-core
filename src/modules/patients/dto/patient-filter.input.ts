import { Field, InputType } from '@nestjs/graphql';
import { IsDate, IsEnum, IsOptional, IsString, IsUUID } from 'class-validator';
import { PatientStatus } from '../../../prisma/generated-client';

@InputType()
export class PatientFilterInput {
  @Field(() => PatientStatus, { nullable: true })
  @IsOptional()
  @IsEnum(PatientStatus)
  status?: PatientStatus;

  @Field({ nullable: true })
  @IsOptional()
  @IsUUID()
  nutritionistId?: string;

  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  search?: string;

  @Field(() => Date, { nullable: true })
  @IsOptional()
  @IsDate()
  createdFrom?: Date;

  @Field(() => Date, { nullable: true })
  @IsOptional()
  @IsDate()
  createdTo?: Date;
}
