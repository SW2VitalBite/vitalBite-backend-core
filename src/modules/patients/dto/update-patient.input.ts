import { Field, InputType } from '@nestjs/graphql';
import {
  IsDate,
  IsEmail,
  IsEnum,
  IsOptional,
  IsString,
  IsUUID,
  Length,
} from 'class-validator';
import { IsNotFutureDate } from '../../../common/validators/is-not-future-date.validator';
import { Gender, PatientStatus } from '../../../prisma/generated-client';

@InputType()
export class UpdatePatientInput {
  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  @Length(1, 100)
  firstName?: string;

  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  @Length(1, 100)
  lastName?: string;

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
