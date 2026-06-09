import { Field, ID, Int, ObjectType } from '@nestjs/graphql';

/**
 * Resultado de solicitar el PDF de una dieta: el Core devuelve la URL prefirmada
 * (recuperando el PDF existente o generándolo al vuelo en el microservicio
 * documental) para que el móvil la abra directamente.
 */
@ObjectType('DietPdfDocument')
export class DietPdfDocumentModel {
  @Field(() => ID, { nullable: true })
  documentId?: string | null;

  @Field()
  url: string;

  @Field()
  fileName: string;

  /** Segundos de validez de la URL prefirmada. */
  @Field(() => Int, { nullable: true })
  expiresIn?: number | null;

  /** `true` si se generó un PDF nuevo, `false` si se reutilizó uno existente. */
  @Field()
  generated: boolean;
}
