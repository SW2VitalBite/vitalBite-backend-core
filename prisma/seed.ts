import 'dotenv/config';
import { PrismaPg } from '@prisma/adapter-pg';
import { hashSync } from 'bcryptjs';
import {
  PrismaClient,
  TenantStatus,
  UserStatus,
} from '../src/generated/prisma/client';

const databaseUrl = process.env.DATABASE_URL;

if (!databaseUrl) {
  throw new Error('DATABASE_URL is required to seed VitalBite Core.');
}

const adapter = new PrismaPg({ connectionString: databaseUrl });
const prisma = new PrismaClient({ adapter });

async function main() {
  await prisma.bodyComposition.deleteMany();
  await prisma.bodyMeasurement.deleteMany();
  await prisma.appointment.deleteMany();
  await prisma.patient.deleteMany();
  await prisma.user.deleteMany();
  await prisma.tenant.deleteMany({
    where: {
      slug: {
        not: 'clinica-central',
      },
    },
  });

  const tenant = await prisma.tenant.upsert({
    where: { slug: 'clinica-central' },
    update: {
      name: 'Clinica Central',
      status: TenantStatus.ACTIVE,
      deletedAt: null,
    },
    create: {
      name: 'Clinica Central',
      slug: 'clinica-central',
      status: TenantStatus.ACTIVE,
    },
  });

  await prisma.user.upsert({
    where: {
      tenantId_email: {
        tenantId: tenant.id,
        email: 'elena.cruz@gmail.com',
      },
    },
    update: {
      firstName: 'Elena',
      lastName: 'Cruz',
      passwordHash: hashSync('demo1234', 10),
      status: UserStatus.ACTIVE,
      roleCode: 'NUTRICIONISTA',
      deletedAt: null,
    },
    create: {
      tenantId: tenant.id,
      email: 'elena.cruz@gmail.com',
      passwordHash: hashSync('demo1234', 10),
      firstName: 'Elena',
      lastName: 'Cruz',
      status: UserStatus.ACTIVE,
      roleCode: 'NUTRICIONISTA',
    },
  });
}

main()
  .finally(async () => {
    await prisma.$disconnect();
  })
  .catch(async (error) => {
    console.error(error);
    await prisma.$disconnect();
    process.exit(1);
  });
