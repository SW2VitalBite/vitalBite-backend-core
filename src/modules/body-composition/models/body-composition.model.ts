import { Field, Float, ID, Int, ObjectType } from '@nestjs/graphql';

@ObjectType('BodyComposition')
export class BodyCompositionModel {
  @Field(() => ID)
  id: string;

  @Field(() => ID)
  tenantId: string;

  @Field(() => ID)
  patientId: string;

  @Field(() => ID, { nullable: true })
  bodyMeasurementId?: string | null;

  @Field(() => Date)
  measuredAt: Date;

  @Field(() => Float, { nullable: true })
  bodyFatPercentage?: number | null;

  @Field(() => Float, { nullable: true })
  muscleMassKg?: number | null;

  @Field(() => Float, { nullable: true })
  waterPercentage?: number | null;

  @Field(() => Float, { nullable: true })
  visceralFatLevel?: number | null;

  @Field(() => Float, { nullable: true })
  boneMassKg?: number | null;

  @Field(() => Int, { nullable: true })
  metabolicAge?: number | null;

  @Field()
  createdAt: Date;

  @Field()
  updatedAt: Date;
}
