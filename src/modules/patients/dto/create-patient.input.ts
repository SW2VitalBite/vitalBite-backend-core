import { Field, InputType, Int } from '@nestjs/graphql';
import {
  IsDate,
  IsEmail,
  IsEnum,
  IsInt,
  IsNumber,
  IsOptional,
  IsString,
  IsUUID,
  Length,
  Max,
  Min,
} from 'class-validator';
import { IsNotFutureDate } from '../../../common/validators/is-not-future-date.validator';
import { Gender, PatientStatus } from '../../../prisma/generated-client';

@InputType()
export class CreatePatientInput {
  @Field()
  @IsString()
  @Length(1, 100)
  firstName: string;

  @Field()
  @IsString()
  @Length(1, 100)
  lastName: string;

  @Field({ nullable: true })
  @IsOptional()
  @IsEmail()
  email?: string;

  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  @Length(1, 30)
  phone?: string;

  @Field(() => Date, { nullable: true })
  @IsOptional()
  @IsDate()
  @IsNotFutureDate()
  birthDate?: Date;

  @Field(() => Gender, { nullable: true })
  @IsOptional()
  @IsEnum(Gender)
  gender?: Gender;

  @Field(() => Int, { nullable: true })
  @IsOptional()
  @IsInt()
  @Min(0)
  @Max(4)
  activityLevel?: number;

  @Field(() => Int, { nullable: true })
  @IsOptional()
  @IsNumber()
  @Min(0)
  @Max(10)
  dietQualityScore?: number;

  @Field(() => Number, { nullable: true })
  @IsOptional()
  @IsInt()
  @Min(0)
  @Max(20)
  comorbiditiesCount?: number;

  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  @Length(1, 200)
  nutritionGoal?: string;

  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  clinicalNotes?: string;

  @Field(() => PatientStatus, { nullable: true })
  @IsOptional()
  @IsEnum(PatientStatus)
  status?: PatientStatus;

  @Field({ nullable: true })
  @IsOptional()
  @IsUUID()
  nutritionistId?: string;
}
