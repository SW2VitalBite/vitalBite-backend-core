import { Field, Float, ID, ObjectType } from '@nestjs/graphql';

@ObjectType('BodyMeasurement')
export class BodyMeasurementModel {
  @Field(() => ID)
  id: string;

  @Field(() => ID)
  tenantId: string;

  @Field(() => ID)
  patientId: string;

  @Field(() => ID)
  registeredById: string;

  @Field(() => Date)
  measuredAt: Date;

  @Field(() => Float)
  weightKg: number;

  @Field(() => Float, { nullable: true })
  heightCm?: number | null;

  @Field(() => Float, { nullable: true })
  bmi?: number | null;

  @Field(() => Float, { nullable: true })
  waistCm?: number | null;

  @Field(() => Float, { nullable: true })
  hipCm?: number | null;

  @Field()
  createdAt: Date;

  @Field()
  updatedAt: Date;
}
