import { Field, ID, ObjectType } from '@nestjs/graphql';
import { Prisma } from '../../../prisma/generated-client';
import { GraphQLJSON } from '../graphql-json.scalar';

@ObjectType('AuditEvent')
export class AuditEventModel {
  @Field(() => ID)
  id: string;

  @Field(() => ID, { nullable: true })
  tenantId?: string | null;

  @Field(() => String, { nullable: true })
  tenantName?: string | null;

  @Field(() => String, { nullable: true })
  tenantSlug?: string | null;

  @Field(() => ID, { nullable: true })
  actorUserId?: string | null;

  @Field(() => ID, { nullable: true })
  actorTenantId?: string | null;

  @Field(() => String, { nullable: true })
  actorEmail?: string | null;

  @Field(() => String, { nullable: true })
  actorRoleCode?: string | null;

  @Field()
  action: string;

  @Field()
  resourceType: string;

  @Field(() => ID, { nullable: true })
  resourceId?: string | null;

  @Field()
  summary: string;

  @Field(() => GraphQLJSON, { nullable: true })
  metadata?: Prisma.JsonValue | null;

  @Field(() => String, { nullable: true })
  previousHash?: string | null;

  @Field()
  eventHash: string;

  @Field()
  createdAt: Date;
}
