import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { createHash } from 'crypto';
import { Prisma } from '../../prisma/generated-client';
import { PrismaService } from '../../prisma/prisma.service';
import { AuthenticatedUser } from '../auth/auth.types';
import { AuditEventsFilterInput } from './dto/audit-events-filter.input';

const TENANT_ADMIN_ROLES = ['ADMINISTRADOR', 'ADMIN'];
const DEFAULT_LIMIT = 50;
const MAX_LIMIT = 200;

export interface RecordAuditEventInput {
  actor: AuthenticatedUser;
  tenantId?: string | null;
  tenantName?: string | null;
  tenantSlug?: string | null;
  action: string;
  resourceType: string;
  resourceId?: string | null;
  summary: string;
  metadata?: Prisma.InputJsonValue | null;
}

@Injectable()
export class AuditService {
  constructor(private readonly prisma: PrismaService) {}

  async recordEvent(input: RecordAuditEventInput) {
    return this.prisma.$transaction(async (transaction) => {
      const previousEvent = await transaction.auditEvent.findFirst({
        orderBy: {
          createdAt: 'desc',
        },
        select: {
          eventHash: true,
        },
      });

      const payload = {
        tenantId: input.tenantId ?? null,
        tenantName: input.tenantName ?? null,
        tenantSlug: input.tenantSlug ?? null,
        actorUserId: input.actor.id,
        actorTenantId: input.actor.tenantId,
        actorEmail: input.actor.email,
        actorRoleCode: input.actor.roleCode,
        action: input.action,
        resourceType: input.resourceType,
        resourceId: input.resourceId ?? null,
        summary: input.summary,
        metadata: input.metadata ?? null,
      };
      const previousHash = previousEvent?.eventHash ?? null;

      return transaction.auditEvent.create({
        data: {
          ...payload,
          metadata: payload.metadata ?? Prisma.JsonNull,
          previousHash,
          eventHash: this.hashPayload(previousHash, payload),
        },
      });
    });
  }

  async findEvents(
    currentUser: AuthenticatedUser,
    filter: AuditEventsFilterInput = {},
  ) {
    const where = this.buildScopedWhere(currentUser, filter);
    const limit = Math.min(filter.limit ?? DEFAULT_LIMIT, MAX_LIMIT);

    return this.prisma.auditEvent.findMany({
      where,
      orderBy: {
        createdAt: 'desc',
      },
      take: limit,
    });
  }

  async findEventById(currentUser: AuthenticatedUser, id: string) {
    const where = this.buildScopedWhere(currentUser, {});
    const event = await this.prisma.auditEvent.findFirst({
      where: {
        AND: [
          where,
          {
            id,
          },
        ],
      },
    });

    if (!event) {
      throw new NotFoundException('Audit event was not found.');
    }

    return event;
  }

  private buildScopedWhere(
    currentUser: AuthenticatedUser,
    filter: AuditEventsFilterInput,
  ): Prisma.AuditEventWhereInput {
    const roleCode = currentUser.roleCode.trim().toUpperCase();
    const where: Prisma.AuditEventWhereInput = {};

    if (roleCode === 'SUPER_ADMIN') {
      if (filter.tenantId) {
        where.tenantId = filter.tenantId;
      }
    } else if (TENANT_ADMIN_ROLES.includes(roleCode)) {
      where.tenantId = currentUser.tenantId;
    } else {
      throw new ForbiddenException('You cannot access audit events.');
    }

    const action = filter.action?.trim();
    if (action) {
      where.action = action.toUpperCase();
    }

    const resourceType = filter.resourceType?.trim();
    if (resourceType) {
      where.resourceType = resourceType.toUpperCase();
    }

    if (filter.dateFrom || filter.dateTo) {
      where.createdAt = {
        ...(filter.dateFrom ? { gte: filter.dateFrom } : {}),
        ...(filter.dateTo ? { lte: filter.dateTo } : {}),
      };
    }

    const search = filter.search?.trim();
    if (search) {
      where.OR = [
        { summary: { contains: search, mode: 'insensitive' } },
        { action: { contains: search, mode: 'insensitive' } },
        { resourceType: { contains: search, mode: 'insensitive' } },
        { resourceId: { contains: search, mode: 'insensitive' } },
        { actorEmail: { contains: search, mode: 'insensitive' } },
        { actorRoleCode: { contains: search, mode: 'insensitive' } },
        { tenantName: { contains: search, mode: 'insensitive' } },
        { tenantSlug: { contains: search, mode: 'insensitive' } },
      ];
    }

    return where;
  }

  private hashPayload(previousHash: string | null, payload: object) {
    return createHash('sha256')
      .update(`${previousHash ?? ''}${this.stableStringify(payload)}`)
      .digest('hex');
  }

  private stableStringify(value: unknown): string {
    if (value === null || typeof value !== 'object') {
      return JSON.stringify(value);
    }

    if (Array.isArray(value)) {
      return `[${value.map((item) => this.stableStringify(item)).join(',')}]`;
    }

    const record = value as Record<string, unknown>;
    return `{${Object.keys(record)
      .sort()
      .map((key) => `${JSON.stringify(key)}:${this.stableStringify(record[key])}`)
      .join(',')}}`;
  }
}
