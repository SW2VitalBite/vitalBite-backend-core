import type { Request } from 'express';
import { Prisma } from '../../prisma/generated-client';

export type AuthenticatedUser = Prisma.UserGetPayload<{
  include: { tenant: true };
}>;

export interface AuthTokenPayload {
  sub: string;
  tenantId: string;
  email: string;
  roleCode: string;
}

export interface AuthRequest extends Request {
  currentUser?: AuthenticatedUser;
}
