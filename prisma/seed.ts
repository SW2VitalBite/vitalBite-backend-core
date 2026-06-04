import 'dotenv/config';
import { PrismaPg } from '@prisma/adapter-pg';
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

  const elena = await prisma.user.upsert({
    where: {
      tenantId_email: {
        tenantId: tenant.id,
        email: 'elena.cruz@gmail.com',
      },
    },
    update: {
      firstName: 'Elena',
      lastName: 'Cruz',
      status: UserStatus.ACTIVE,
      roleCode: 'NUTRICIONISTA',
      deletedAt: null,
    },
    create: {
      tenantId: tenant.id,
      email: 'elena.cruz@gmail.com',
      firstName: 'Elena',
      lastName: 'Cruz',
      status: UserStatus.ACTIVE,
      roleCode: 'NUTRICIONISTA',
    },
  });

  const sofia = await prisma.user.upsert({
    where: {
      tenantId_email: {
        tenantId: tenant.id,
        email: 'sofia.paredes@gmail.com',
      },
    },
    update: {
      firstName: 'Sofia',
      lastName: 'Paredes',
      status: UserStatus.ACTIVE,
      roleCode: 'NUTRICIONISTA',
      deletedAt: null,
    },
    create: {
      tenantId: tenant.id,
      email: 'sofia.paredes@gmail.com',
      firstName: 'Sofia',
      lastName: 'Paredes',
      status: UserStatus.ACTIVE,
      roleCode: 'NUTRICIONISTA',
    },
  });

  const patients = [
    {
      email: 'ana.rojas@gmail.com',
      firstName: 'Ana',
      lastName: 'Rojas',
      phone: '70012345',
      birthDate: new Date('1992-05-14T00:00:00.000Z'),
      gender: Gender.FEMALE,
      status: PatientStatus.ACTIVE,
      nutritionGoal: 'Bajar grasa corporal',
      clinicalNotes:
        'Refiere baja adherencia durante la ultima semana. Revisar distribucion de comidas y registrar nueva medida de cintura.',
      nutritionistId: elena.id,
    },
    {
      email: 'luis.pinto@gmail.com',
      firstName: 'Luis',
      lastName: 'Pinto',
      phone: '70023456',
      birthDate: new Date('1988-11-22T00:00:00.000Z'),
      gender: Gender.MALE,
      status: PatientStatus.ACTIVE,
      nutritionGoal: 'Ganar masa muscular',
      clinicalNotes:
        'Seguimiento orientado a fuerza, distribucion proteica y control de medidas.',
      nutritionistId: elena.id,
    },
    {
      email: 'marta.silva@gmail.com',
      firstName: 'Marta',
      lastName: 'Silva',
      phone: '70034567',
      birthDate: new Date('1979-03-31T00:00:00.000Z'),
      gender: Gender.FEMALE,
      status: PatientStatus.ACTIVE,
      nutritionGoal: 'Control glucosa',
      clinicalNotes:
        'Paciente con antecedentes de resistencia a la insulina y objetivo de control de peso.',
      nutritionistId: sofia.id,
    },
    {
      email: 'carlos.meza@gmail.com',
      firstName: 'Carlos',
      lastName: 'Meza',
      phone: '70045678',
      birthDate: new Date('1995-08-09T00:00:00.000Z'),
      gender: Gender.MALE,
      status: PatientStatus.INACTIVE,
      nutritionGoal: 'Mantener peso',
      clinicalNotes: 'Plan de mantenimiento con controles mensuales.',
      nutritionistId: elena.id,
    },
    {
      email: 'sofia.arias@gmail.com',
      firstName: 'Sofia',
      lastName: 'Arias',
      phone: '70056789',
      birthDate: new Date('1990-01-18T00:00:00.000Z'),
      gender: Gender.FEMALE,
      status: PatientStatus.INACTIVE,
      nutritionGoal: 'Reducir cintura',
      clinicalNotes:
        'Seguimiento pendiente para revisar adherencia y ajuste de plan.',
      nutritionistId: sofia.id,
    },
  ];

  const savedPatients = new Map<string, { id: string }>();

  for (const patient of patients) {
    const savedPatient = await prisma.patient.upsert({
      where: {
        tenantId_email: {
          tenantId: tenant.id,
          email: patient.email,
        },
      },
      update: {
        ...patient,
        deletedAt: null,
      },
      create: {
        tenantId: tenant.id,
        ...patient,
      },
    });

    savedPatients.set(patient.email, savedPatient);
  }

  const appointments = [
    {
      patientEmail: 'luis.pinto@gmail.com',
      nutritionistId: elena.id,
      scheduledAt: new Date('2026-06-08T09:00:00.000Z'),
      durationMinutes: 45,
      status: AppointmentStatus.CONFIRMED,
      mode: AppointmentMode.IN_PERSON,
      reason: 'Control de medidas y adherencia',
      notes: 'Revisar progreso de fuerza y distribucion proteica.',
    },
    {
      patientEmail: 'ana.rojas@gmail.com',
      nutritionistId: elena.id,
      scheduledAt: new Date('2026-06-09T10:30:00.000Z'),
      durationMinutes: 45,
      status: AppointmentStatus.CONFIRMED,
      mode: AppointmentMode.IN_PERSON,
      reason: 'Seguimiento nutricional',
      notes: 'Revisar registro de comidas de la ultima semana.',
    },
    {
      patientEmail: 'marta.silva@gmail.com',
      nutritionistId: sofia.id,
      scheduledAt: new Date('2026-06-10T11:00:00.000Z'),
      durationMinutes: 60,
      status: AppointmentStatus.RESCHEDULED,
      mode: AppointmentMode.VIRTUAL,
      reason: 'Control glucosa',
      notes: 'Cita reprogramada para revisar adherencia y sintomas.',
    },
    {
      patientEmail: 'carlos.meza@gmail.com',
      nutritionistId: elena.id,
      scheduledAt: new Date('2026-06-11T08:30:00.000Z'),
      durationMinutes: 45,
      status: AppointmentStatus.COMPLETED,
      mode: AppointmentMode.IN_PERSON,
      reason: 'Consulta de mantenimiento',
      notes: 'Control mensual completado.',
    },
    {
      patientEmail: 'sofia.arias@gmail.com',
      nutritionistId: sofia.id,
      scheduledAt: new Date('2026-06-08T15:30:00.000Z'),
      durationMinutes: 45,
      status: AppointmentStatus.SCHEDULED,
      mode: AppointmentMode.IN_PERSON,
      reason: 'Evaluacion de adherencia',
      notes: 'Pendiente revisar ajuste de plan.',
    },
    {
      patientEmail: 'ana.rojas@gmail.com',
      nutritionistId: elena.id,
      scheduledAt: new Date('2026-06-11T16:00:00.000Z'),
      durationMinutes: 45,
      status: AppointmentStatus.SCHEDULED,
      mode: AppointmentMode.VIRTUAL,
      reason: 'Ajuste de plan alimenticio',
      notes: 'Preparar recomendaciones para la siguiente semana.',
    },
  ];

  for (const appointment of appointments) {
    const patient = savedPatients.get(appointment.patientEmail);

    if (!patient) {
      throw new Error(
        `Seed patient ${appointment.patientEmail} was not found.`,
      );
    }

    await prisma.appointment.upsert({
      where: {
        tenantId_patientId_scheduledAt: {
          tenantId: tenant.id,
          patientId: patient.id,
          scheduledAt: appointment.scheduledAt,
        },
      },
      update: {
        nutritionistId: appointment.nutritionistId,
        durationMinutes: appointment.durationMinutes,
        status: appointment.status,
        mode: appointment.mode,
        reason: appointment.reason,
        notes: appointment.notes,
        cancelReason: null,
        deletedAt: null,
      },
      create: {
        tenantId: tenant.id,
        patientId: patient.id,
        nutritionistId: appointment.nutritionistId,
        scheduledAt: appointment.scheduledAt,
        durationMinutes: appointment.durationMinutes,
        status: appointment.status,
        mode: appointment.mode,
        reason: appointment.reason,
        notes: appointment.notes,
      },
    });
  }

  const bodyMeasurements = [
    {
      patientEmail: 'ana.rojas@gmail.com',
      registeredById: elena.id,
      measuredAt: new Date('2026-05-01T09:00:00.000Z'),
      weightKg: 72.4,
      heightCm: 165,
      waistCm: 86,
      hipCm: 101,
      composition: {
        bodyFatPercentage: 34.2,
        muscleMassKg: 43.1,
        waterPercentage: 48.5,
        visceralFatLevel: 8,
        boneMassKg: 2.6,
        metabolicAge: 36,
      },
    },
    {
      patientEmail: 'ana.rojas@gmail.com',
      registeredById: elena.id,
      measuredAt: new Date('2026-06-01T09:00:00.000Z'),
      weightKg: 70.8,
      heightCm: 165,
      waistCm: 83,
      hipCm: 99,
      composition: {
        bodyFatPercentage: 32.8,
        muscleMassKg: 43.7,
        waterPercentage: 49.4,
        visceralFatLevel: 7,
        boneMassKg: 2.6,
        metabolicAge: 35,
      },
    },
    {
      patientEmail: 'luis.pinto@gmail.com',
      registeredById: elena.id,
      measuredAt: new Date('2026-05-03T10:00:00.000Z'),
      weightKg: 78.1,
      heightCm: 176,
      waistCm: 84,
      hipCm: 96,
      composition: {
        bodyFatPercentage: 20.8,
        muscleMassKg: 59.6,
        waterPercentage: 56.2,
        visceralFatLevel: 5,
        boneMassKg: 3.1,
        metabolicAge: 31,
      },
    },
    {
      patientEmail: 'luis.pinto@gmail.com',
      registeredById: elena.id,
      measuredAt: new Date('2026-06-03T10:00:00.000Z'),
      weightKg: 79.4,
      heightCm: 176,
      waistCm: 83,
      hipCm: 96,
      composition: {
        bodyFatPercentage: 19.7,
        muscleMassKg: 60.9,
        waterPercentage: 57.1,
        visceralFatLevel: 5,
        boneMassKg: 3.1,
        metabolicAge: 30,
      },
    },
    {
      patientEmail: 'marta.silva@gmail.com',
      registeredById: sofia.id,
      measuredAt: new Date('2026-05-05T11:00:00.000Z'),
      weightKg: 81.2,
      heightCm: 160,
      waistCm: 96,
      hipCm: 108,
      composition: {
        bodyFatPercentage: 39.4,
        muscleMassKg: 42.3,
        waterPercentage: 45.9,
        visceralFatLevel: 10,
        boneMassKg: 2.5,
        metabolicAge: 48,
      },
    },
    {
      patientEmail: 'marta.silva@gmail.com',
      registeredById: sofia.id,
      measuredAt: new Date('2026-06-05T11:00:00.000Z'),
      weightKg: 79.6,
      heightCm: 160,
      waistCm: 93,
      hipCm: 106,
      composition: {
        bodyFatPercentage: 38.1,
        muscleMassKg: 42.8,
        waterPercentage: 46.8,
        visceralFatLevel: 9,
        boneMassKg: 2.5,
        metabolicAge: 47,
      },
    },
    {
      patientEmail: 'carlos.meza@gmail.com',
      registeredById: elena.id,
      measuredAt: new Date('2026-05-07T08:30:00.000Z'),
      weightKg: 70.1,
      heightCm: 171,
      waistCm: 80,
      hipCm: 94,
      composition: {
        bodyFatPercentage: 22.4,
        muscleMassKg: 51.8,
        waterPercentage: 54.6,
        visceralFatLevel: 6,
        boneMassKg: 2.9,
        metabolicAge: 32,
      },
    },
    {
      patientEmail: 'carlos.meza@gmail.com',
      registeredById: elena.id,
      measuredAt: new Date('2026-06-07T08:30:00.000Z'),
      weightKg: 70.3,
      heightCm: 171,
      waistCm: 80,
      hipCm: 94,
      composition: {
        bodyFatPercentage: 22.1,
        muscleMassKg: 52,
        waterPercentage: 54.8,
        visceralFatLevel: 6,
        boneMassKg: 2.9,
        metabolicAge: 32,
      },
    },
    {
      patientEmail: 'sofia.arias@gmail.com',
      registeredById: sofia.id,
      measuredAt: new Date('2026-05-09T15:30:00.000Z'),
      weightKg: 68.6,
      heightCm: 162,
      waistCm: 88,
      hipCm: 103,
      composition: {
        bodyFatPercentage: 35.6,
        muscleMassKg: 40.8,
        waterPercentage: 47.5,
        visceralFatLevel: 8,
        boneMassKg: 2.4,
        metabolicAge: 39,
      },
    },
    {
      patientEmail: 'sofia.arias@gmail.com',
      registeredById: sofia.id,
      measuredAt: new Date('2026-06-09T15:30:00.000Z'),
      weightKg: 67.9,
      heightCm: 162,
      waistCm: 86,
      hipCm: 102,
      composition: {
        bodyFatPercentage: 34.9,
        muscleMassKg: 41.1,
        waterPercentage: 48.1,
        visceralFatLevel: 8,
        boneMassKg: 2.4,
        metabolicAge: 38,
      },
    },
  ];

  for (const measurement of bodyMeasurements) {
    const patient = savedPatients.get(measurement.patientEmail);

    if (!patient) {
      throw new Error(
        `Seed patient ${measurement.patientEmail} was not found.`,
      );
    }

    const heightMeters = measurement.heightCm / 100;
    const bmi = Number(
      (measurement.weightKg / (heightMeters * heightMeters)).toFixed(2),
    );

    const savedMeasurement = await prisma.bodyMeasurement.upsert({
      where: {
        tenantId_patientId_measuredAt: {
          tenantId: tenant.id,
          patientId: patient.id,
          measuredAt: measurement.measuredAt,
        },
      },
      update: {
        registeredById: measurement.registeredById,
        weightKg: measurement.weightKg,
        heightCm: measurement.heightCm,
        bmi,
        waistCm: measurement.waistCm,
        hipCm: measurement.hipCm,
        deletedAt: null,
      },
      create: {
        tenantId: tenant.id,
        patientId: patient.id,
        registeredById: measurement.registeredById,
        measuredAt: measurement.measuredAt,
        weightKg: measurement.weightKg,
        heightCm: measurement.heightCm,
        bmi,
        waistCm: measurement.waistCm,
        hipCm: measurement.hipCm,
      },
    });

    await prisma.bodyComposition.upsert({
      where: {
        tenantId_patientId_measuredAt: {
          tenantId: tenant.id,
          patientId: patient.id,
          measuredAt: measurement.measuredAt,
        },
      },
      update: {
        bodyMeasurementId: savedMeasurement.id,
        ...measurement.composition,
        deletedAt: null,
      },
      create: {
        tenantId: tenant.id,
        patientId: patient.id,
        bodyMeasurementId: savedMeasurement.id,
        measuredAt: measurement.measuredAt,
        ...measurement.composition,
      },
    });
  }
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
