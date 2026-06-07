import { Field, ID, ObjectType } from '@nestjs/graphql';
import { Gender, PatientStatus } from '../../../prisma/generated-client';

@ObjectType('Patient')
export class PatientModel {
  @Field(() => ID)
  id: string;

  @Field(() => ID)
  tenantId: string;

  @Field(() => ID)
  nutritionistId: string;

  @Field()
  firstName: string;

  @Field()
  lastName: string;

  @Field()
  fullName: string;

  @Field(() => String, { nullable: true })
  email?: string | null;

  @Field(() => String, { nullable: true })
  phone?: string | null;

  @Field(() => Date, { nullable: true })
  birthDate?: Date | null;

  @Field(() => Gender, { nullable: true })
  gender?: Gender | null;

  @Field(() => PatientStatus)
  status: PatientStatus;

  @Field(() => String, { nullable: true })
  clinicalNotes?: string | null;

  @Field(() => String, { nullable: true })
  nutritionGoal?: string | null;

  @Field(() => Number, { nullable: true })
  heightCm?: number | null;

  @Field()
  createdAt: Date;

  @Field()
  updatedAt: Date;
}
