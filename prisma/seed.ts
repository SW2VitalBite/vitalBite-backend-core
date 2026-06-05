import 'dotenv/config';
import { PrismaPg } from '@prisma/adapter-pg';
import { hashSync } from 'bcryptjs';
import {
  AppointmentMode,
  AppointmentStatus,
  Gender,
  PatientStatus,
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
        notIn: [
          'clinica-central',
          'consulta-individual-andrea',
          'vitalbite-system',
        ],
      },
    },
  });

  const systemTenant = await prisma.tenant.upsert({
    where: { slug: 'vitalbite-system' },
    update: {
      name: 'VitalBite Admin',
      status: TenantStatus.ACTIVE,
      deletedAt: null,
    },
    create: {
      name: 'VitalBite Admin',
      slug: 'vitalbite-system',
      status: TenantStatus.ACTIVE,
    },
  });

  await prisma.user.upsert({
    where: {
      tenantId_email: {
        tenantId: systemTenant.id,
        email: 'super.admin@vitalbite.com',
      },
    },
    update: {
      firstName: 'Super',
      lastName: 'Admin',
      passwordHash: hashSync('demo1234', 10),
      status: UserStatus.ACTIVE,
      roleCode: 'SUPER_ADMIN',
      deletedAt: null,
    },
    create: {
      tenantId: systemTenant.id,
      email: 'super.admin@vitalbite.com',
      passwordHash: hashSync('demo1234', 10),
      firstName: 'Super',
      lastName: 'Admin',
      status: UserStatus.ACTIVE,
      roleCode: 'SUPER_ADMIN',
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

  const nutritionist = await prisma.user.upsert({
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

  await prisma.user.upsert({
    where: {
      tenantId_email: {
        tenantId: tenant.id,
        email: 'admin.central@vitalbite.com',
      },
    },
    update: {
      firstName: 'Valeria',
      lastName: 'Mendoza',
      passwordHash: hashSync('demo1234', 10),
      status: UserStatus.ACTIVE,
      roleCode: 'ADMINISTRADOR',
      deletedAt: null,
    },
    create: {
      tenantId: tenant.id,
      email: 'admin.central@vitalbite.com',
      passwordHash: hashSync('demo1234', 10),
      firstName: 'Valeria',
      lastName: 'Mendoza',
      status: UserStatus.ACTIVE,
      roleCode: 'ADMINISTRADOR',
    },
  });

  const individualTenant = await prisma.tenant.upsert({
    where: { slug: 'consulta-individual-andrea' },
    update: {
      name: 'Consulta Individual Andrea',
      status: TenantStatus.ACTIVE,
      deletedAt: null,
    },
    create: {
      name: 'Consulta Individual Andrea',
      slug: 'consulta-individual-andrea',
      status: TenantStatus.ACTIVE,
    },
  });

  await prisma.user.upsert({
    where: {
      tenantId_email: {
        tenantId: individualTenant.id,
        email: 'andrea.morales@vitalbite.com',
      },
    },
    update: {
      firstName: 'Andrea',
      lastName: 'Morales',
      passwordHash: hashSync('demo1234', 10),
      status: UserStatus.ACTIVE,
      roleCode: 'NUTRICIONISTA',
      deletedAt: null,
    },
    create: {
      tenantId: individualTenant.id,
      email: 'andrea.morales@vitalbite.com',
      passwordHash: hashSync('demo1234', 10),
      firstName: 'Andrea',
      lastName: 'Morales',
      status: UserStatus.ACTIVE,
      roleCode: 'NUTRICIONISTA',
    },
  });

  const patients = await Promise.all(
    [
      {
        firstName: 'Ana',
        lastName: 'Rojas',
        email: 'ana.rojas@email.com',
        phone: '70012345',
        birthDate: new Date('1992-05-14T00:00:00.000Z'),
        gender: Gender.FEMALE,
        status: PatientStatus.INACTIVE,
        nutritionGoal: 'Bajar grasa corporal',
        clinicalNotes:
          'Refiere baja adherencia durante la ultima semana. Revisar distribucion de comidas y registrar nueva medida de cintura en la cita de hoy.',
        createdAt: new Date('2026-06-04T09:00:00.000Z'),
      },
      {
        firstName: 'Luis',
        lastName: 'Pinto',
        email: 'luis.pinto@email.com',
        phone: '70123456',
        birthDate: new Date('1988-09-22T00:00:00.000Z'),
        gender: Gender.MALE,
        status: PatientStatus.ACTIVE,
        nutritionGoal: 'Ganar masa muscular',
        clinicalNotes:
          'Plan activo con buena tolerancia. Priorizar seguimiento de proteinas y entrenamiento de fuerza.',
        createdAt: new Date('2026-06-03T09:00:00.000Z'),
      },
      {
        firstName: 'Marta',
        lastName: 'Silva',
        email: 'marta.silva@email.com',
        phone: '70234567',
        birthDate: new Date('1979-03-08T00:00:00.000Z'),
        gender: Gender.FEMALE,
        status: PatientStatus.INACTIVE,
        nutritionGoal: 'Control glucosa',
        clinicalNotes:
          'Paciente requiere seguimiento cercano de horarios y carga glucemica en comidas principales.',
        createdAt: new Date('2026-05-31T09:00:00.000Z'),
      },
      {
        firstName: 'Carlos',
        lastName: 'Meza',
        email: 'carlos.meza@email.com',
        phone: '70345678',
        birthDate: new Date('1985-11-17T00:00:00.000Z'),
        gender: Gender.MALE,
        status: PatientStatus.ACTIVE,
        nutritionGoal: 'Mantener peso',
        clinicalNotes:
          'Evolucion estable. Mantener controles mensuales y registrar composicion corporal.',
        createdAt: new Date('2026-05-29T09:00:00.000Z'),
      },
      {
        firstName: 'Sofia',
        lastName: 'Arias',
        email: 'sofia.arias@email.com',
        phone: '70456789',
        birthDate: new Date('1997-07-30T00:00:00.000Z'),
        gender: Gender.FEMALE,
        status: PatientStatus.INACTIVE,
        nutritionGoal: 'Reducir cintura',
        clinicalNotes:
          'Seguimiento pendiente. Validar medidas y ajustar plan si es necesario.',
        createdAt: new Date('2026-05-28T09:00:00.000Z'),
      },
    ].map((patient) =>
      prisma.patient.create({
        data: {
          ...patient,
          tenantId: tenant.id,
          nutritionistId: nutritionist.id,
        },
      }),
    ),
  );

  await Promise.all(
    [
      {
        firstName: 'Paola',
        lastName: 'Vaca',
        email: 'paola.vaca@email.com',
      },
      {
        firstName: 'Miguel',
        lastName: 'Rios',
        email: 'miguel.rios@email.com',
      },
    ].map((patient) =>
      prisma.patient.create({
        data: {
          ...patient,
          tenantId: tenant.id,
          nutritionistId: nutritionist.id,
          phone: null,
          gender: Gender.NOT_SPECIFIED,
          status: PatientStatus.ARCHIVED,
          nutritionGoal: 'Seguimiento cerrado',
          clinicalNotes: 'Paciente archivado para demostracion de filtros.',
          createdAt: new Date('2026-05-20T09:00:00.000Z'),
          deletedAt: new Date('2026-05-20T12:00:00.000Z'),
        },
      }),
    ),
  );

  const appointmentSeeds = [
    {
      patient: patients[0],
      scheduledAt: new Date('2026-06-04T14:30:00.000Z'),
      durationMinutes: 45,
      status: AppointmentStatus.CONFIRMED,
      reason: 'Control de medidas y adherencia',
      notes: 'Actualizar peso y cintura. Revisar registro de comidas.',
    },
    {
      patient: patients[1],
      scheduledAt: new Date('2026-06-03T15:00:00.000Z'),
      durationMinutes: 45,
      status: AppointmentStatus.COMPLETED,
      reason: 'Seguimiento de masa muscular',
      notes: 'Revisar progreso de plan activo.',
    },
    {
      patient: patients[2],
      scheduledAt: new Date('2026-05-31T13:30:00.000Z'),
      durationMinutes: 45,
      status: AppointmentStatus.COMPLETED,
      reason: 'Control glucosa',
      notes: 'Evaluar adherencia y sintomas reportados.',
    },
    {
      patient: patients[3],
      scheduledAt: new Date('2026-05-29T16:00:00.000Z'),
      durationMinutes: 30,
      status: AppointmentStatus.COMPLETED,
      reason: 'Mantenimiento de peso',
      notes: 'Control mensual sin alertas.',
    },
    {
      patient: patients[4],
      scheduledAt: new Date('2026-05-28T12:00:00.000Z'),
      durationMinutes: 45,
      status: AppointmentStatus.SCHEDULED,
      reason: 'Revision de cintura',
      notes: 'Registrar medida y seguimiento pendiente.',
    },
  ];

  await Promise.all(
    appointmentSeeds.map((appointment) =>
      prisma.appointment.create({
        data: {
          tenantId: tenant.id,
          patientId: appointment.patient.id,
          nutritionistId: nutritionist.id,
          scheduledAt: appointment.scheduledAt,
          durationMinutes: appointment.durationMinutes,
          status: appointment.status,
          mode: AppointmentMode.IN_PERSON,
          reason: appointment.reason,
          notes: appointment.notes,
        },
      }),
    ),
  );

  await Promise.all(
    [
      {
        patient: patients[0],
        measuredAt: new Date('2026-05-31T10:00:00.000Z'),
        weightKg: 68.4,
        heightCm: 164,
        waistCm: 86,
        hipCm: 100,
      },
      {
        patient: patients[1],
        measuredAt: new Date('2026-06-02T11:00:00.000Z'),
        weightKg: 74.2,
        heightCm: 178,
        waistCm: 82,
        hipCm: 96,
      },
      {
        patient: patients[2],
        measuredAt: new Date('2026-05-30T09:30:00.000Z'),
        weightKg: 71.5,
        heightCm: 160,
        waistCm: 91,
        hipCm: 103,
      },
      {
        patient: patients[3],
        measuredAt: new Date('2026-05-28T14:00:00.000Z'),
        weightKg: 79.1,
        heightCm: 174,
        waistCm: 88,
        hipCm: 99,
      },
      {
        patient: patients[4],
        measuredAt: new Date('2026-05-27T08:45:00.000Z'),
        weightKg: 63.8,
        heightCm: 158,
        waistCm: 80,
        hipCm: 95,
      },
    ].map((measurement) => {
      const heightMeters = measurement.heightCm / 100;
      const bmi = Number(
        (measurement.weightKg / (heightMeters * heightMeters)).toFixed(2),
      );

      return prisma.bodyMeasurement.create({
        data: {
          tenantId: tenant.id,
          patientId: measurement.patient.id,
          registeredById: nutritionist.id,
          measuredAt: measurement.measuredAt,
          weightKg: measurement.weightKg,
          heightCm: measurement.heightCm,
          bmi,
          waistCm: measurement.waistCm,
          hipCm: measurement.hipCm,
        },
      });
    }),
  );
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
