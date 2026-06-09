import { Field, ID, ObjectType } from '@nestjs/graphql';

@ObjectType('PatientDocument')
export class PatientDocumentModel {
  @Field(() => ID)
  id: string;

  /** Nombre/clave del archivo en S3 (p. ej. `pdfs/dieta-...pdf`). */
  @Field()
  fileName: string;

  /** Tipo de documento: `DIETA_PDF`, `INVOICE_PDF`, … */
  @Field()
  type: string;

  /** ID del recurso de origen (dieta, factura, …) en el Core. */
  @Field(() => String, { nullable: true })
  resourceId?: string | null;

  /** URL prefirmada de S3 (caduca; se regenera al listar). */
  @Field(() => String, { nullable: true })
  url?: string | null;

  @Field(() => String, { nullable: true })
  patientFullName?: string | null;

  @Field(() => String, { nullable: true })
  nutritionistFullName?: string | null;

  @Field(() => String, { nullable: true })
  status?: string | null;

  @Field(() => String, { nullable: true })
  hash?: string | null;

  @Field(() => Date, { nullable: true })
  createdAt?: Date | null;
}
