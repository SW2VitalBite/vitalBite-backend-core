import { Field, Float, ID, Int, ObjectType } from '@nestjs/graphql';
import { GraphQLJSON } from '../../audit/graphql-json.scalar';

@ObjectType()
export class ClusterInfoModel {
  @Field(() => Int)
  cluster_id: number;

  @Field()
  label: string;

  @Field(() => Int)
  total_pacientes: number;

  @Field(() => Float)
  porcentaje: number;

  @Field()
  feature_dominante: string;

  @Field(() => GraphQLJSON)
  caracteristicas: Record<string, number>;
}

@ObjectType()
export class PatientClusterPointModel {
  @Field(() => ID)
  patient_id: string;

  @Field(() => Int)
  cluster_id: number;

  @Field(() => Float)
  x: number;

  @Field(() => Float)
  y: number;

  @Field(() => Float)
  z: number;
}

@ObjectType()
export class PatientSegmentationModel {
  @Field(() => ID)
  id: string;

  @Field(() => Int)
  kClusters: number;

  @Field(() => Int)
  totalPatients: number;

  @Field(() => Float, { nullable: true })
  silhouetteScore?: number | null;

  @Field(() => [ClusterInfoModel])
  clusters: ClusterInfoModel[];

  @Field(() => [PatientClusterPointModel])
  pcaPoints: PatientClusterPointModel[];

  @Field(() => [Float])
  varianceExplained: number[];

  @Field()
  createdAt: Date;
}
