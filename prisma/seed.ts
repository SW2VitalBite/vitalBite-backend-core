import 'dotenv/config';
import { PrismaPg } from '@prisma/adapter-pg';
import { hashSync } from 'bcryptjs';
import {
  AppointmentMode,
  AppointmentStatus,
  DietPlanStatus,
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
  const anthropometryMeasurement = (prisma as any).anthropometryMeasurement;

  await prisma.dietPlan.deleteMany();
  await anthropometryMeasurement.deleteMany();
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

  const bodyMeasurements = await Promise.all(
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

  await Promise.all([
    anthropometryMeasurement.create({
      data: {
        tenantId: tenant.id,
        patientId: patients[0].id,
        bodyMeasurementId: bodyMeasurements[0].id,
        measuredAt: new Date('2026-05-31T10:00:00.000Z'),
        neckCm: 34.5,
        chestThoraxCm: 92,
        rightArmCm: 29.8,
        leftArmCm: 29.2,
        rightForearmCm: 24.5,
        leftForearmCm: 24.1,
        waistCm: 86,
        abdomenCm: 90,
        hipCm: 100,
        rightThighCm: 57,
        leftThighCm: 56.7,
        rightCalfCm: 35.8,
        leftCalfCm: 35.3,
      },
    }),
    anthropometryMeasurement.create({
      data: {
        tenantId: tenant.id,
        patientId: patients[3].id,
        bodyMeasurementId: bodyMeasurements[3].id,
        measuredAt: new Date('2026-05-28T14:00:00.000Z'),
        neckCm: 38,
        chestThoraxCm: 98.5,
        rightArmCm: 32.5,
        leftArmCm: 31.8,
        rightForearmCm: 27,
        leftForearmCm: 26.5,
        waistCm: 88,
        abdomenCm: 88,
        hipCm: 98,
        rightThighCm: 56,
        leftThighCm: 55.5,
        rightCalfCm: 36,
        leftCalfCm: 35.5,
      },
    }),
  ]);

  await Promise.all([
    prisma.dietPlan.create({
      data: {
        tenantId: tenant.id,
        patientId: patients[0].id,
        nutritionistId: nutritionist.id,
        name: 'Plan antiinflamatorio',
        objective: 'Bajar grasa',
        phase: 'Semana 4',
        approach: 'Antiinflamatorio',
        startDate: new Date('2026-06-05T00:00:00.000Z'),
        endDate: new Date('2026-07-12T00:00:00.000Z'),
        status: DietPlanStatus.ACTIVE,
        mealsPerDay: 4,
        mainRestriction: 'Sin bebidas azucaradas',
        notes:
          'Ajuste enfocado en adherencia, antiinflamacion y control de ansiedad nocturna dentro del plan actual de la paciente.',
        estimatedCalories: 1570,
        adherencePercent: 82,
        days: {
          create: [
            {
              dayLabel: 'Lunes',
              dayOrder: 1,
              meals: {
                create: [
                  {
                    name: 'Desayuno',
                    mealOrder: 1,
                    targetCalories: 420,
                    items: {
                      create: [
                        { name: 'Avena cocida', portion: '1 taza', calories: 150, itemOrder: 1 },
                        { name: 'Huevos revueltos', portion: '2 unidades', calories: 180, itemOrder: 2 },
                        { name: 'Frutillas', portion: '1/2 taza', calories: 90, itemOrder: 3 },
                      ],
                    },
                  },
                  {
                    name: 'Almuerzo',
                    mealOrder: 2,
                    targetCalories: 560,
                    items: {
                      create: [
                        { name: 'Pollo grillado', portion: '140 g', calories: 240, itemOrder: 1 },
                        { name: 'Quinoa cocida', portion: '3/4 taza', calories: 170, itemOrder: 2 },
                        { name: 'Ensalada verde', portion: '1 porcion', calories: 150, itemOrder: 3 },
                      ],
                    },
                  },
                  {
                    name: 'Cena',
                    mealOrder: 3,
                    targetCalories: 390,
                    items: {
                      create: [
                        { name: 'Crema de verduras', portion: '1 bowl', calories: 160, itemOrder: 1 },
                        { name: 'Pescado al horno', portion: '120 g', calories: 170, itemOrder: 2 },
                        { name: 'Infusion', portion: '1 taza', calories: 60, itemOrder: 3 },
                      ],
                    },
                  },
                  {
                    name: 'Colaciones',
                    mealOrder: 4,
                    targetCalories: 200,
                    items: {
                      create: [
                        { name: 'Yogur griego', portion: '1 unidad', calories: 110, itemOrder: 1 },
                        { name: 'Nueces', portion: '15 g', calories: 90, itemOrder: 2 },
                      ],
                    },
                  },
                ],
              },
            },
            {
              dayLabel: 'Martes',
              dayOrder: 2,
              meals: {
                create: [
                  {
                    name: 'Desayuno',
                    mealOrder: 1,
                    targetCalories: 410,
                    items: {
                      create: [
                        { name: 'Pan integral', portion: '2 rebanadas', calories: 170, itemOrder: 1 },
                        { name: 'Palta', portion: '1/4 unidad', calories: 90, itemOrder: 2 },
                        { name: 'Papaya', portion: '1 taza', calories: 150, itemOrder: 3 },
                      ],
                    },
                  },
                ],
              },
            },
          ],
        },
      },
    }),
    prisma.dietPlan.create({
      data: {
        tenantId: tenant.id,
        patientId: patients[0].id,
        nutritionistId: nutritionist.id,
        name: 'Plan glucemico base',
        objective: 'Control glucemico',
        phase: 'Borrador',
        approach: 'Control de carga glucemica',
        status: DietPlanStatus.DRAFT,
        mealsPerDay: 4,
        mainRestriction: 'Sin bebidas azucaradas',
        notes: 'Borrador para ajuste posterior segun registro de adherencia.',
        days: {
          create: [
            {
              dayLabel: 'Lunes',
              dayOrder: 1,
              meals: {
                create: [
                  { name: 'Desayuno', mealOrder: 1, targetCalories: 380 },
                  { name: 'Almuerzo', mealOrder: 2, targetCalories: 520 },
                  { name: 'Cena', mealOrder: 3, targetCalories: 360 },
                  { name: 'Colaciones', mealOrder: 4, targetCalories: 180 },
                ],
              },
            },
          ],
        },
      },
    }),
    prisma.dietPlan.create({
      data: {
        tenantId: tenant.id,
        patientId: patients[0].id,
        nutritionistId: nutritionist.id,
        name: 'Plan recomposicion',
        objective: 'Mantenimiento muscular',
        phase: 'Semana 8',
        approach: 'Recomposicion',
        endDate: new Date('2026-06-09T00:00:00.000Z'),
        status: DietPlanStatus.NEEDS_ADJUSTMENT,
        mealsPerDay: 4,
        notes: 'Revisar por vencimiento cercano y ajustar fibra nocturna.',
      },
    }),
  ]);
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
