import { Field, Float, ID, ObjectType } from '@nestjs/graphql';

@ObjectType('AnthropometryMeasurement')
export class AnthropometryMeasurementModel {
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
  neckCm?: number | null;

  @Field(() => Float, { nullable: true })
  chestThoraxCm?: number | null;

  @Field(() => Float, { nullable: true })
  rightArmCm?: number | null;

  @Field(() => Float, { nullable: true })
  leftArmCm?: number | null;

  @Field(() => Float, { nullable: true })
  rightForearmCm?: number | null;

  @Field(() => Float, { nullable: true })
  leftForearmCm?: number | null;

  @Field(() => Float, { nullable: true })
  waistCm?: number | null;

  @Field(() => Float, { nullable: true })
  abdomenCm?: number | null;

  @Field(() => Float, { nullable: true })
  hipCm?: number | null;

  @Field(() => Float, { nullable: true })
  rightThighCm?: number | null;

  @Field(() => Float, { nullable: true })
  leftThighCm?: number | null;

  @Field(() => Float, { nullable: true })
  rightCalfCm?: number | null;

  @Field(() => Float, { nullable: true })
  leftCalfCm?: number | null;

  @Field()
  createdAt: Date;

  @Field()
  updatedAt: Date;
}
