import { Field, Float, ID, Int, ObjectType } from '@nestjs/graphql';
import { Gender, PatientStatus } from '../../../prisma/generated-client';
import { DocumentMetadataModel } from './document-metadata.model';

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

  @Field(() => Int, { nullable: true })
  activityLevel?: number | null;

  @Field(() => Float, { nullable: true })
  dietQualityScore?: number | null;

  @Field(() => Int, { nullable: true })
  comorbiditiesCount?: number | null;

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

  @Field(() => [DocumentMetadataModel], { nullable: 'itemsAndList' })
  documents?: DocumentMetadataModel[];
}
