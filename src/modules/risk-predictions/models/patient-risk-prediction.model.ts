import { Field, Float, ID, ObjectType, registerEnumType } from '@nestjs/graphql';
import { GraphQLJSON } from '../../audit/graphql-json.scalar';

export enum PatientRiskPredictionStatus {
  SUCCESS = 'SUCCESS',
  REUSED = 'REUSED',
  INSUFFICIENT_DATA = 'INSUFFICIENT_DATA',
  UNAVAILABLE = 'UNAVAILABLE',
}

registerEnumType(PatientRiskPredictionStatus, {
  name: 'PatientRiskPredictionStatus',
});

@ObjectType('PatientRiskPrediction')
export class PatientRiskPredictionModel {
  @Field(() => PatientRiskPredictionStatus)
  status: PatientRiskPredictionStatus;

  @Field(() => String, { nullable: true })
  nivelRiesgo?: string | null;

  @Field(() => Float, { nullable: true })
  probabilidad?: number | null;

  @Field(() => GraphQLJSON, { nullable: true })
  probabilidades?: Record<string, number> | null;

  @Field(() => [String])
  factoresCriticos: string[];

  @Field(() => String, { nullable: true })
  recomendacion?: string | null;

  @Field(() => Date, { nullable: true })
  createdAt?: Date | null;

  @Field(() => ID, { nullable: true })
  sourceMeasurementId?: string | null;

  @Field(() => ID, { nullable: true })
  sourceCompositionId?: string | null;
}
