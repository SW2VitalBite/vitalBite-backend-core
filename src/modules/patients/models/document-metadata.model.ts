import { Field, ID, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class DocumentMetadataModel {
  @Field(() => ID)
  id: string;

  @Field()
  tenantId: string;

  @Field()
  patientId: string;

  @Field()
  nutritionistId: string;

  @Field({ nullable: true })
  resourceId?: string;

  @Field()
  tipoDocumento: string;

  @Field()
  nombreArchivo: string;

  @Field({ nullable: true })
  pacienteNombre?: string;

  @Field({ nullable: true })
  nutricionistaNombre?: string;

  @Field({ nullable: true })
  s3Url?: string;

  @Field({ nullable: true })
  hashDocumento?: string;

  @Field({ nullable: true })
  estado?: string;

  @Field()
  createdAt: Date;

  @Field()
  updatedAt: Date;
}
