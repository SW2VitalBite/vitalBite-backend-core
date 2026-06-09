import 'dotenv/config';
import { PrismaPg } from '@prisma/adapter-pg';
import { hashSync } from 'bcryptjs';
import {
  AppointmentMode,
  AppointmentStatus,
  DietPlanStatus,
  Gender,
  NotificationType,
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

// ─── Utilidades ───────────────────────────────────────────────────────────────

function bmi(weightKg: number, heightCm: number) {
  const h = heightCm / 100;
  return Number((weightKg / (h * h)).toFixed(2));
}

function daysAgo(n: number, hour = 10, minute = 0) {
  const d = new Date();
  d.setDate(d.getDate() - n);
  d.setHours(hour, minute, 0, 0);
  return d;
}

function daysFromNow(n: number, hour = 10, minute = 0) {
  const d = new Date();
  d.setDate(d.getDate() + n);
  d.setHours(hour, minute, 0, 0);
  return d;
}

// ─── Main ─────────────────────────────────────────────────────────────────────

async function main() {
  console.log('🌱 Iniciando seed de VitalBite...');

  // ── 1. Limpiar tablas en orden de dependencias ──────────────────────────────
  console.log('🗑  Limpiando tablas...');

  await prisma.notification.deleteMany();
  await prisma.dietMealItem.deleteMany();
  await prisma.dietMeal.deleteMany();
  await prisma.dietPlanDay.deleteMany();
  await prisma.dietPlan.deleteMany();
  await prisma.anthropometryMeasurement.deleteMany();
  await prisma.bodyComposition.deleteMany();
  await prisma.bodyMeasurement.deleteMany();
  await prisma.appointment.deleteMany();
  
  // Clean up risk predictions if they exist
  try {
    await (prisma as any).patientRiskPrediction.deleteMany();
  } catch {}
  try {
    await (prisma as any).riskPrediction.deleteMany();
  } catch {}
  try {
    await (prisma as any).patientSegmentation.deleteMany();
  } catch {}

  await prisma.patient.deleteMany();
  await prisma.user.deleteMany();
  await prisma.tenant.deleteMany({
    where: {
      slug: {
        notIn: [
          'clinica-central',
          'consulta-individual-andrea',
          'vitalbite-system',
          'clinica-nutrifit',
        ],
      },
    },
  });

  // ── 2. Tenant de sistema + Super Admin ──────────────────────────────────────
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

  // ── 3. Clínica Central (panel web / nutricionista + admin) ──────────────────
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
        patient: patients[0],
        measuredAt: new Date('2026-04-15T10:00:00.000Z'),
        weightKg: 70.1,
        heightCm: 164,
        waistCm: 89,
        hipCm: 102,
      },
      {
        patient: patients[0],
        measuredAt: new Date('2026-02-20T10:00:00.000Z'),
        weightKg: 72.5,
        heightCm: 164,
        waistCm: 92,
        hipCm: 105,
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
    ].map((measurement) =>
      prisma.bodyMeasurement.create({
        data: {
          tenantId: tenant.id,
          patientId: measurement.patient.id,
          registeredById: nutritionist.id,
          measuredAt: measurement.measuredAt,
          weightKg: measurement.weightKg,
          heightCm: measurement.heightCm,
          bmi: bmi(measurement.weightKg, measurement.heightCm),
          waistCm: measurement.waistCm,
          hipCm: measurement.hipCm,
        },
      }),
    ),
  );

  await Promise.all([
    prisma.anthropometryMeasurement.create({
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
    prisma.anthropometryMeasurement.create({
      data: {
        tenantId: tenant.id,
        patientId: patients[0].id,
        bodyMeasurementId: bodyMeasurements[1].id,
        measuredAt: new Date('2026-04-15T10:00:00.000Z'),
        neckCm: 35.0,
        chestThoraxCm: 94,
        rightArmCm: 30.5,
        leftArmCm: 30.0,
        rightForearmCm: 25.0,
        leftForearmCm: 24.8,
        waistCm: 89,
        abdomenCm: 92,
        hipCm: 102,
        rightThighCm: 58.5,
        leftThighCm: 58.0,
        rightCalfCm: 36.2,
        leftCalfCm: 36.0,
      },
    }),
    prisma.anthropometryMeasurement.create({
      data: {
        tenantId: tenant.id,
        patientId: patients[0].id,
        bodyMeasurementId: bodyMeasurements[2].id,
        measuredAt: new Date('2026-02-20T10:00:00.000Z'),
        neckCm: 35.5,
        chestThoraxCm: 96,
        rightArmCm: 31.2,
        leftArmCm: 30.8,
        rightForearmCm: 25.5,
        leftForearmCm: 25.2,
        waistCm: 92,
        abdomenCm: 95,
        hipCm: 105,
        rightThighCm: 60.0,
        leftThighCm: 59.5,
        rightCalfCm: 37.0,
        leftCalfCm: 36.8,
      },
    }),
    prisma.anthropometryMeasurement.create({
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
        name: 'Plan intensivo',
        objective: 'Definición',
        phase: 'Fase final',
        approach: 'Déficit calórico',
        status: DietPlanStatus.ACTIVE,
        mealsPerDay: 4,
        notes: 'Plan intensivo para las últimas 4 semanas con el objetivo de alcanzar la definición final.',
        days: {
          create: [
            {
              dayLabel: 'Lunes',
              dayOrder: 1,
              meals: {
                create: [
                  { name: 'Desayuno', mealOrder: 1, targetCalories: 350 },
                  { name: 'Almuerzo', mealOrder: 2, targetCalories: 500 },
                  { name: 'Cena', mealOrder: 3, targetCalories: 350 },
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

  // ── 4. Clínica NutriFit — datos para pruebas de la app móvil ────────────────
  // Credenciales paciente: maria.gonzalez@vitalbite.com / demo1234 (slug: clinica-nutrifit)
  console.log('📱 Creando consultorio y paciente de pruebas móviles...');

  const mobileTenant = await prisma.tenant.upsert({
    where: { slug: 'clinica-nutrifit' },
    update: {
      name: 'Clínica NutriFit',
      status: TenantStatus.ACTIVE,
      deletedAt: null,
    },
    create: {
      name: 'Clínica NutriFit',
      slug: 'clinica-nutrifit',
      status: TenantStatus.ACTIVE,
    },
  });

  const mobileNutritionist = await prisma.user.upsert({
    where: {
      tenantId_email: {
        tenantId: mobileTenant.id,
        email: 'elena.cruz@vitalbite.com',
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
      tenantId: mobileTenant.id,
      email: 'elena.cruz@vitalbite.com',
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
        tenantId: mobileTenant.id,
        email: 'admin@vitalbite.com',
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
      tenantId: mobileTenant.id,
      email: 'admin@vitalbite.com',
      passwordHash: hashSync('demo1234', 10),
      firstName: 'Valeria',
      lastName: 'Mendoza',
      status: UserStatus.ACTIVE,
      roleCode: 'ADMINISTRADOR',
    },
  });

  const maria = await prisma.patient.create({
    data: {
      tenantId: mobileTenant.id,
      nutritionistId: mobileNutritionist.id,
      firstName: 'María',
      lastName: 'González',
      email: 'maria.gonzalez@vitalbite.com',
      passwordHash: hashSync('demo1234', 10),
      phone: '70011223',
      birthDate: new Date('1995-08-14T00:00:00.000Z'),
      gender: Gender.FEMALE,
      status: PatientStatus.ACTIVE,
      heightCm: 164,
      nutritionGoal: 'Pérdida de grasa con preservación muscular',
      clinicalNotes:
        'Buena adherencia al plan. Progreso constante en reducción de grasa corporal. Monitorear hidratación diaria.',
    },
  });

  const mariaMeasData = [
    { daysBack: 175, weightKg: 74.0, waistCm: 85, hipCm: 100 },
    { daysBack: 145, weightKg: 72.8, waistCm: 83, hipCm: 99 },
    { daysBack: 115, weightKg: 71.5, waistCm: 81, hipCm: 98 },
    { daysBack: 85, weightKg: 70.2, waistCm: 79, hipCm: 97 },
    { daysBack: 55, weightKg: 68.5, waistCm: 77, hipCm: 96 },
    { daysBack: 20, weightKg: 67.2, waistCm: 75, hipCm: 95 },
    { daysBack: 0, weightKg: 66.8, waistCm: 74, hipCm: 94 },
  ];

  const mariaMeasurements = await Promise.all(
    mariaMeasData.map((m) =>
      prisma.bodyMeasurement.create({
        data: {
          tenantId: mobileTenant.id,
          patientId: maria.id,
          registeredById: mobileNutritionist.id,
          measuredAt: daysAgo(m.daysBack, 9, 30),
          weightKg: m.weightKg,
          heightCm: 164,
          bmi: bmi(m.weightKg, 164),
          waistCm: m.waistCm,
          hipCm: m.hipCm,
        },
      }),
    ),
  );

  const mariaCompData = [
    { daysBack: 175, fat: 28.2, muscle: 25.0, water: 52.0, bone: 2.6, visceral: 8, age: 32 },
    { daysBack: 145, fat: 27.0, muscle: 25.4, water: 52.8, bone: 2.6, visceral: 7, age: 32 },
    { daysBack: 115, fat: 25.8, muscle: 25.9, water: 53.5, bone: 2.7, visceral: 7, age: 31 },
    { daysBack: 85, fat: 24.6, muscle: 26.4, water: 54.1, bone: 2.7, visceral: 6, age: 31 },
    { daysBack: 55, fat: 23.5, muscle: 26.9, water: 54.8, bone: 2.7, visceral: 6, age: 30 },
    { daysBack: 20, fat: 22.4, muscle: 27.4, water: 55.4, bone: 2.8, visceral: 5, age: 30 },
    { daysBack: 0, fat: 21.8, muscle: 27.8, water: 55.9, bone: 2.8, visceral: 5, age: 29 },
  ];

  await Promise.all(
    mariaCompData.map((c, i) =>
      prisma.bodyComposition.create({
        data: {
          tenantId: mobileTenant.id,
          patientId: maria.id,
          bodyMeasurementId: mariaMeasurements[i].id,
          measuredAt: daysAgo(c.daysBack, 9, 30),
          bodyFatPercentage: c.fat,
          muscleMassKg: c.muscle,
          waterPercentage: c.water,
          boneMassKg: c.bone,
          visceralFatLevel: c.visceral,
          metabolicAge: c.age,
        },
      }),
    ),
  );

  await Promise.all([
    prisma.appointment.create({
      data: {
        tenantId: mobileTenant.id,
        patientId: maria.id,
        nutritionistId: mobileNutritionist.id,
        scheduledAt: daysFromNow(5, 10, 0),
        durationMinutes: 45,
        status: AppointmentStatus.SCHEDULED,
        mode: AppointmentMode.IN_PERSON,
        reason: 'Control mensual y ajuste de plan',
        notes: 'Revisar adherencia al plan de alimentación.',
      },
    }),
    prisma.appointment.create({
      data: {
        tenantId: mobileTenant.id,
        patientId: maria.id,
        nutritionistId: mobileNutritionist.id,
        scheduledAt: daysFromNow(12, 14, 30),
        durationMinutes: 30,
        status: AppointmentStatus.CONFIRMED,
        mode: AppointmentMode.VIRTUAL,
        reason: 'Revisión de composición corporal',
        notes: 'Traer registro de comidas de la semana.',
      },
    }),
    prisma.appointment.create({
      data: {
        tenantId: mobileTenant.id,
        patientId: maria.id,
        nutritionistId: mobileNutritionist.id,
        scheduledAt: daysAgo(8, 10, 0),
        durationMinutes: 45,
        status: AppointmentStatus.COMPLETED,
        mode: AppointmentMode.IN_PERSON,
        reason: 'Seguimiento de plan de dieta',
        notes: 'Paciente reporta buena tolerancia. Peso bajó 1.3 kg. Se mantiene el plan.',
      },
    }),
  ]);

  const mariaDiet = await prisma.dietPlan.create({
    data: {
      tenantId: mobileTenant.id,
      patientId: maria.id,
      nutritionistId: mobileNutritionist.id,
      name: 'Plan Balance — Fase 2',
      objective:
        'Pérdida de grasa sostenida con preservación de masa muscular. Meta: 64 kg en 3 meses.',
      phase: 'Fase 2',
      approach: 'Déficit calórico moderado',
      startDate: daysAgo(20),
      status: DietPlanStatus.ACTIVE,
      mealsPerDay: 4,
      estimatedCalories: 1600,
      adherencePercent: 88,
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
                  targetCalories: 548,
                  items: {
                    create: [
                      { name: 'Avena cocida', portion: '80 g', calories: 290, itemOrder: 1 },
                      { name: 'Banana mediana', portion: '1 unidad', calories: 90, itemOrder: 2 },
                      { name: 'Leche descremada', portion: '200 ml', calories: 70, itemOrder: 3 },
                      { name: 'Nueces', portion: '15 g', calories: 98, itemOrder: 4 },
                    ],
                  },
                },
                {
                  name: 'Almuerzo',
                  mealOrder: 2,
                  targetCalories: 528,
                  items: {
                    create: [
                      { name: 'Pechuga de pollo a la plancha', portion: '150 g', calories: 248, itemOrder: 1 },
                      { name: 'Arroz integral cocido', portion: '150 g', calories: 165, itemOrder: 2 },
                      { name: 'Brócoli al vapor', portion: '150 g', calories: 51, itemOrder: 3 },
                      { name: 'Aceite de oliva', portion: '5 ml', calories: 44, itemOrder: 4 },
                    ],
                  },
                },
                {
                  name: 'Merienda',
                  mealOrder: 3,
                  targetCalories: 310,
                  items: {
                    create: [
                      { name: 'Almendras naturales', portion: '30 g', calories: 173, itemOrder: 1 },
                      { name: 'Manzana verde', portion: '1 unidad', calories: 78, itemOrder: 2 },
                      { name: 'Yogur griego sin azúcar', portion: '100 g', calories: 59, itemOrder: 3 },
                    ],
                  },
                },
                {
                  name: 'Cena',
                  mealOrder: 4,
                  targetCalories: 346,
                  items: {
                    create: [
                      { name: 'Salmón al horno', portion: '120 g', calories: 218, itemOrder: 1 },
                      { name: 'Camote asado', portion: '100 g', calories: 86, itemOrder: 2 },
                      { name: 'Espárragos a la plancha', portion: '150 g', calories: 34, itemOrder: 3 },
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
                  targetCalories: 455,
                  items: {
                    create: [
                      { name: 'Pan integral', portion: '2 rebanadas', calories: 160, itemOrder: 1 },
                      { name: 'Huevos revueltos', portion: '2 unidades', calories: 156, itemOrder: 2 },
                      { name: 'Palta', portion: '1/4 unidad', calories: 80, itemOrder: 3 },
                      { name: 'Café con leche descremada', portion: '200 ml', calories: 59, itemOrder: 4 },
                    ],
                  },
                },
                {
                  name: 'Almuerzo',
                  mealOrder: 2,
                  targetCalories: 544,
                  items: {
                    create: [
                      { name: 'Carne magra de res a la plancha', portion: '130 g', calories: 250, itemOrder: 1 },
                      { name: 'Quinua cocida', portion: '150 g', calories: 180, itemOrder: 2 },
                      { name: 'Ensalada mixta', portion: '1 porción', calories: 70, itemOrder: 3 },
                      { name: 'Aceite de oliva', portion: '5 ml', calories: 44, itemOrder: 4 },
                    ],
                  },
                },
                {
                  name: 'Merienda',
                  mealOrder: 3,
                  targetCalories: 300,
                  items: {
                    create: [
                      { name: 'Batido de proteína con agua', portion: '1 scoop', calories: 120, itemOrder: 1 },
                      { name: 'Plátano', portion: '1 unidad', calories: 90, itemOrder: 2 },
                      { name: 'Mantequilla de maní', portion: '10 g', calories: 90, itemOrder: 3 },
                    ],
                  },
                },
                {
                  name: 'Cena',
                  mealOrder: 4,
                  targetCalories: 320,
                  items: {
                    create: [
                      { name: 'Filete de merluza al horno', portion: '140 g', calories: 150, itemOrder: 1 },
                      { name: 'Puré de calabaza', portion: '150 g', calories: 90, itemOrder: 2 },
                      { name: 'Judías verdes salteadas', portion: '120 g', calories: 45, itemOrder: 3 },
                      { name: 'Aceite de oliva', portion: '5 ml', calories: 35, itemOrder: 4 },
                    ],
                  },
                },
              ],
            },
          },
          {
            dayLabel: 'Miércoles',
            dayOrder: 3,
            meals: {
              create: [
                {
                  name: 'Desayuno',
                  mealOrder: 1,
                  targetCalories: 443,
                  items: {
                    create: [
                      { name: 'Yogur griego natural', portion: '200 g', calories: 130, itemOrder: 1 },
                      { name: 'Avena en hojuelas', portion: '40 g', calories: 150, itemOrder: 2 },
                      { name: 'Fresas', portion: '100 g', calories: 32, itemOrder: 3 },
                      { name: 'Semillas de chía', portion: '15 g', calories: 73, itemOrder: 4 },
                      { name: 'Almendras', portion: '10 g', calories: 58, itemOrder: 5 },
                    ],
                  },
                },
                {
                  name: 'Almuerzo',
                  mealOrder: 2,
                  targetCalories: 530,
                  items: {
                    create: [
                      { name: 'Lomo de cerdo magro a la plancha', portion: '130 g', calories: 230, itemOrder: 1 },
                      { name: 'Camote al horno', portion: '150 g', calories: 130, itemOrder: 2 },
                      { name: 'Ensalada de espinaca y zanahoria', portion: '1 porción', calories: 80, itemOrder: 3 },
                      { name: 'Palta', portion: '1/4 unidad', calories: 80, itemOrder: 4 },
                      { name: 'Aderezo de limón', portion: '1 cdita', calories: 10, itemOrder: 5 },
                    ],
                  },
                },
                {
                  name: 'Merienda',
                  mealOrder: 3,
                  targetCalories: 308,
                  items: {
                    create: [
                      { name: 'Queso cottage', portion: '150 g', calories: 130, itemOrder: 1 },
                      { name: 'Tostadas integrales', portion: '2 unidades', calories: 120, itemOrder: 2 },
                      { name: 'Tomate cherry', portion: '80 g', calories: 18, itemOrder: 3 },
                      { name: 'Nueces', portion: '15 g', calories: 40, itemOrder: 4 },
                    ],
                  },
                },
                {
                  name: 'Cena',
                  mealOrder: 4,
                  targetCalories: 330,
                  items: {
                    create: [
                      { name: 'Pechuga de pavo a la plancha', portion: '140 g', calories: 200, itemOrder: 1 },
                      { name: 'Calabacín y berenjena al horno', portion: '150 g', calories: 70, itemOrder: 2 },
                      { name: 'Quinua cocida', portion: '60 g', calories: 60, itemOrder: 3 },
                    ],
                  },
                },
              ],
            },
          },
          {
            dayLabel: 'Jueves',
            dayOrder: 4,
            meals: {
              create: [
                {
                  name: 'Desayuno',
                  mealOrder: 1,
                  targetCalories: 490,
                  items: {
                    create: [
                      { name: 'Tortilla de claras y 1 huevo', portion: '3 claras + 1 huevo', calories: 160, itemOrder: 1 },
                      { name: 'Pan integral', portion: '2 rebanadas', calories: 160, itemOrder: 2 },
                      { name: 'Aguacate', portion: '1/4 unidad', calories: 80, itemOrder: 3 },
                      { name: 'Jugo de naranja natural', portion: '200 ml', calories: 90, itemOrder: 4 },
                    ],
                  },
                },
                {
                  name: 'Almuerzo',
                  mealOrder: 2,
                  targetCalories: 539,
                  items: {
                    create: [
                      { name: 'Pollo al curry ligero', portion: '150 g', calories: 250, itemOrder: 1 },
                      { name: 'Arroz integral cocido', portion: '150 g', calories: 165, itemOrder: 2 },
                      { name: 'Vegetales salteados', portion: '150 g', calories: 80, itemOrder: 3 },
                      { name: 'Aceite de oliva', portion: '5 ml', calories: 44, itemOrder: 4 },
                    ],
                  },
                },
                {
                  name: 'Merienda',
                  mealOrder: 3,
                  targetCalories: 290,
                  items: {
                    create: [
                      { name: 'Yogur griego sin azúcar', portion: '150 g', calories: 90, itemOrder: 1 },
                      { name: 'Frutos rojos', portion: '100 g', calories: 50, itemOrder: 2 },
                      { name: 'Granola sin azúcar', portion: '30 g', calories: 135, itemOrder: 3 },
                      { name: 'Miel', portion: '5 g', calories: 15, itemOrder: 4 },
                    ],
                  },
                },
                {
                  name: 'Cena',
                  mealOrder: 4,
                  targetCalories: 300,
                  items: {
                    create: [
                      { name: 'Atún a la plancha', portion: '130 g', calories: 180, itemOrder: 1 },
                      { name: 'Ensalada de garbanzos', portion: '80 g', calories: 90, itemOrder: 2 },
                      { name: 'Tomate y pepino', portion: '1 porción', calories: 30, itemOrder: 3 },
                    ],
                  },
                },
              ],
            },
          },
          {
            dayLabel: 'Viernes',
            dayOrder: 5,
            meals: {
              create: [
                {
                  name: 'Desayuno',
                  mealOrder: 1,
                  targetCalories: 473,
                  items: {
                    create: [
                      { name: 'Leche descremada', portion: '200 ml', calories: 70, itemOrder: 1 },
                      { name: 'Proteína whey', portion: '1 scoop', calories: 120, itemOrder: 2 },
                      { name: 'Banana', portion: '1 unidad', calories: 90, itemOrder: 3 },
                      { name: 'Avena en hojuelas', portion: '30 g', calories: 110, itemOrder: 4 },
                      { name: 'Semillas de chía', portion: '15 g', calories: 73, itemOrder: 5 },
                    ],
                  },
                },
                {
                  name: 'Almuerzo',
                  mealOrder: 2,
                  targetCalories: 520,
                  items: {
                    create: [
                      { name: 'Salmón a la plancha', portion: '140 g', calories: 250, itemOrder: 1 },
                      { name: 'Papa cocida', portion: '150 g', calories: 130, itemOrder: 2 },
                      { name: 'Brócoli y coliflor al vapor', portion: '150 g', calories: 60, itemOrder: 3 },
                      { name: 'Palta', portion: '1/4 unidad', calories: 80, itemOrder: 4 },
                    ],
                  },
                },
                {
                  name: 'Merienda',
                  mealOrder: 3,
                  targetCalories: 328,
                  items: {
                    create: [
                      { name: 'Tostadas integrales', portion: '2 unidades', calories: 120, itemOrder: 1 },
                      { name: 'Hummus', portion: '40 g', calories: 90, itemOrder: 2 },
                      { name: 'Bastones de zanahoria y apio', portion: '1 porción', calories: 40, itemOrder: 3 },
                      { name: 'Huevo duro', portion: '1 unidad', calories: 78, itemOrder: 4 },
                    ],
                  },
                },
                {
                  name: 'Cena',
                  mealOrder: 4,
                  targetCalories: 325,
                  items: {
                    create: [
                      { name: 'Pechuga de pollo a la plancha', portion: '140 g', calories: 230, itemOrder: 1 },
                      { name: 'Ensalada verde grande', portion: '1 porción', calories: 60, itemOrder: 2 },
                      { name: 'Aceite de oliva', portion: '5 ml', calories: 35, itemOrder: 3 },
                    ],
                  },
                },
              ],
            },
          },
          {
            dayLabel: 'Sábado',
            dayOrder: 6,
            meals: {
              create: [
                {
                  name: 'Desayuno',
                  mealOrder: 1,
                  targetCalories: 466,
                  items: {
                    create: [
                      { name: 'Panqueques de avena y plátano', portion: '2 unidades', calories: 280, itemOrder: 1 },
                      { name: 'Yogur griego sin azúcar', portion: '100 g', calories: 59, itemOrder: 2 },
                      { name: 'Fresas', portion: '100 g', calories: 32, itemOrder: 3 },
                      { name: 'Miel', portion: '10 g', calories: 30, itemOrder: 4 },
                      { name: 'Nueces', portion: '10 g', calories: 65, itemOrder: 5 },
                    ],
                  },
                },
                {
                  name: 'Almuerzo',
                  mealOrder: 2,
                  targetCalories: 529,
                  items: {
                    create: [
                      { name: 'Estofado de carne magra', portion: '150 g', calories: 260, itemOrder: 1 },
                      { name: 'Arroz integral cocido', portion: '150 g', calories: 165, itemOrder: 2 },
                      { name: 'Ensalada criolla', portion: '1 porción', calories: 60, itemOrder: 3 },
                      { name: 'Aceite de oliva', portion: '5 ml', calories: 44, itemOrder: 4 },
                    ],
                  },
                },
                {
                  name: 'Merienda',
                  mealOrder: 3,
                  targetCalories: 305,
                  items: {
                    create: [
                      { name: 'Batido de proteína con agua', portion: '1 scoop', calories: 120, itemOrder: 1 },
                      { name: 'Manzana', portion: '1 unidad', calories: 78, itemOrder: 2 },
                      { name: 'Almendras naturales', portion: '20 g', calories: 115, itemOrder: 3 },
                    ],
                  },
                },
                {
                  name: 'Cena',
                  mealOrder: 4,
                  targetCalories: 320,
                  items: {
                    create: [
                      { name: 'Tilapia al horno', portion: '150 g', calories: 160, itemOrder: 1 },
                      { name: 'Camote asado', portion: '120 g', calories: 105, itemOrder: 2 },
                      { name: 'Espárragos y zanahoria al vapor', portion: '150 g', calories: 55, itemOrder: 3 },
                    ],
                  },
                },
              ],
            },
          },
          {
            dayLabel: 'Domingo',
            dayOrder: 7,
            meals: {
              create: [
                {
                  name: 'Desayuno',
                  mealOrder: 1,
                  targetCalories: 510,
                  items: {
                    create: [
                      { name: 'Huevos rancheros', portion: '2 huevos + salsa', calories: 220, itemOrder: 1 },
                      { name: 'Tortilla integral', portion: '1 unidad', calories: 120, itemOrder: 2 },
                      { name: 'Frijoles', portion: '80 g', calories: 90, itemOrder: 3 },
                      { name: 'Palta', portion: '1/4 unidad', calories: 80, itemOrder: 4 },
                    ],
                  },
                },
                {
                  name: 'Almuerzo',
                  mealOrder: 2,
                  targetCalories: 540,
                  items: {
                    create: [
                      { name: 'Pollo al horno con hierbas', portion: '160 g', calories: 270, itemOrder: 1 },
                      { name: 'Puré de papa con leche descremada', portion: '150 g', calories: 150, itemOrder: 2 },
                      { name: 'Ensalada mixta', portion: '1 porción', calories: 70, itemOrder: 3 },
                      { name: 'Aceite de oliva', portion: '5 ml', calories: 44, itemOrder: 4 },
                    ],
                  },
                },
                {
                  name: 'Merienda',
                  mealOrder: 3,
                  targetCalories: 280,
                  items: {
                    create: [
                      { name: 'Yogur griego sin azúcar', portion: '150 g', calories: 90, itemOrder: 1 },
                      { name: 'Granola sin azúcar', portion: '30 g', calories: 135, itemOrder: 2 },
                      { name: 'Arándanos', portion: '80 g', calories: 46, itemOrder: 3 },
                    ],
                  },
                },
                {
                  name: 'Cena',
                  mealOrder: 4,
                  targetCalories: 300,
                  items: {
                    create: [
                      { name: 'Crema de verduras', portion: '1 bowl', calories: 120, itemOrder: 1 },
                      { name: 'Filete de pescado al horno', portion: '120 g', calories: 150, itemOrder: 2 },
                      { name: 'Ensalada verde', portion: '1 porción', calories: 40, itemOrder: 3 },
                    ],
                  },
                },
              ],
            },
          },
        ],
      },
    },
  });

  console.log('🔔 Creando notificaciones para María...');

  await prisma.notification.createMany({
    data: [
      {
        tenantId: mobileTenant.id,
        patientId: maria.id,
        type: NotificationType.DIETA_ASIGNADA,
        title: 'Nueva dieta asignada',
        body: 'Tu nutricionista ha asignado un nuevo plan de alimentación: Plan Balance — Fase 2.',
        data: { dietPlanId: mariaDiet.id },
        isRead: false,
        createdAt: daysAgo(0, 8, 15),
      },
      {
        tenantId: mobileTenant.id,
        patientId: maria.id,
        type: NotificationType.CITA_CREADA,
        title: 'Cita programada',
        body: 'Tu cita con Elena Cruz está confirmada para dentro de 5 días a las 10:00.',
        data: {},
        isRead: false,
        createdAt: daysAgo(0, 8, 10),
      },
      {
        tenantId: mobileTenant.id,
        patientId: maria.id,
        type: NotificationType.MENSAJE,
        title: 'Mensaje de tu nutricionista',
        body: 'Hola María, recuerda aumentar tu consumo de agua a 2.5L diarios esta semana.',
        data: {},
        isRead: false,
        createdAt: daysAgo(1, 17, 30),
      },
      {
        tenantId: mobileTenant.id,
        patientId: maria.id,
        type: NotificationType.CITA_CONFIRMADA,
        title: 'Cita confirmada',
        body: 'Tu cita de revisión mensual ha sido confirmada por tu nutricionista.',
        data: {},
        isRead: true,
        createdAt: daysAgo(8, 9, 45),
      },
      {
        tenantId: mobileTenant.id,
        patientId: maria.id,
        type: NotificationType.REPORTE,
        title: 'Reporte mensual disponible',
        body: 'Tu informe de progreso de mayo está listo. Bajaste 1.7 kg este mes. ¡Excelente trabajo!',
        data: {},
        isRead: true,
        createdAt: daysAgo(38, 10, 0),
      },
    ],
  });

  // ── 4b. Cohorte de pacientes para pruebas de IA (segmentación + riesgo) ──────
  // Perfiles variados en el consultorio de Elena (clinica-nutrifit) para que el
  // nutricionista pueda probar CU10 (Random Forest) y CU11 (K-means) con datos
  // coherentes: distintos IMC, % grasa, masa muscular, variación de peso (3m) y
  // adherencia. Cada paciente tiene una medición previa (~90 días) y otra actual
  // (para calcular variacion_peso_3m_kg) + composición corporal y un plan activo.
  console.log('🧪 Creando cohorte de pacientes para pruebas de IA...');

  const iaCohort = [
    {
      firstName: 'Roberto',
      lastName: 'Silva',
      email: 'roberto.silva@nutrifit.com',
      gender: Gender.MALE,
      birthDate: new Date('1975-02-11T00:00:00.000Z'),
      heightCm: 172,
      nutritionGoal: 'Reducir peso y riesgo cardiovascular',
      clinicalNotes: 'Estilo de vida sedentario, hipertensión y prediabetes. Riesgo alto.',
      // peso sube (variación positiva) → mayor riesgo
      prevWeightKg: 92.0,
      weightKg: 95.0,
      waistCm: 108,
      hipCm: 110,
      fat: 34.0,
      muscle: 30.5,
      water: 48.0,
      bone: 3.4,
      visceral: 15,
      metabolicAge: 58,
      adherence: 45,
    },
    {
      firstName: 'Carmen',
      lastName: 'Ortiz',
      email: 'carmen.ortiz@nutrifit.com',
      gender: Gender.FEMALE,
      birthDate: new Date('1968-06-23T00:00:00.000Z'),
      heightCm: 158,
      nutritionGoal: 'Control de peso y glucosa',
      clinicalNotes: 'Sobrepeso con baja actividad física. Diabetes tipo 2 controlada.',
      prevWeightKg: 80.5,
      weightKg: 82.0,
      waistCm: 98,
      hipCm: 112,
      fat: 40.0,
      muscle: 22.0,
      water: 45.0,
      bone: 2.5,
      visceral: 12,
      metabolicAge: 60,
      adherence: 52,
    },
    {
      firstName: 'Patricia',
      lastName: 'Vega',
      email: 'patricia.vega@nutrifit.com',
      gender: Gender.FEMALE,
      birthDate: new Date('1972-10-05T00:00:00.000Z'),
      heightCm: 162,
      nutritionGoal: 'Mejorar composición corporal',
      clinicalNotes: 'Riesgo intermedio. Actividad física moderada e irregular.',
      prevWeightKg: 75.0,
      weightKg: 74.0,
      waistCm: 92,
      hipCm: 104,
      fat: 33.0,
      muscle: 23.5,
      water: 50.0,
      bone: 2.6,
      visceral: 9,
      metabolicAge: 50,
      adherence: 70,
    },
    {
      firstName: 'Andrés',
      lastName: 'Castro',
      email: 'andres.castro@nutrifit.com',
      gender: Gender.MALE,
      birthDate: new Date('1983-04-18T00:00:00.000Z'),
      heightCm: 176,
      nutritionGoal: 'Bajar grasa abdominal',
      clinicalNotes: 'Sobrepeso moderado, sin comorbilidades. Trabajo de oficina.',
      prevWeightKg: 86.0,
      weightKg: 88.0,
      waistCm: 95,
      hipCm: 102,
      fat: 26.0,
      muscle: 35.0,
      water: 53.0,
      bone: 3.2,
      visceral: 10,
      metabolicAge: 42,
      adherence: 68,
    },
    {
      firstName: 'Lucía',
      lastName: 'Romero',
      email: 'lucia.romero@nutrifit.com',
      gender: Gender.FEMALE,
      birthDate: new Date('1998-12-02T00:00:00.000Z'),
      heightCm: 166,
      nutritionGoal: 'Tonificar y mantener peso',
      clinicalNotes: 'Activa, entrena 4 veces por semana. Riesgo bajo.',
      prevWeightKg: 61.0,
      weightKg: 60.0,
      waistCm: 70,
      hipCm: 94,
      fat: 22.0,
      muscle: 24.5,
      water: 56.0,
      bone: 2.6,
      visceral: 4,
      metabolicAge: 24,
      adherence: 92,
    },
    {
      firstName: 'Diego',
      lastName: 'Fuentes',
      email: 'diego.fuentes@nutrifit.com',
      gender: Gender.MALE,
      birthDate: new Date('1990-07-09T00:00:00.000Z'),
      heightCm: 180,
      nutritionGoal: 'Ganar masa muscular',
      clinicalNotes: 'Deportista, muy activo. Riesgo bajo, excelente adherencia.',
      prevWeightKg: 79.0,
      weightKg: 78.0,
      waistCm: 82,
      hipCm: 96,
      fat: 15.0,
      muscle: 38.5,
      water: 60.0,
      bone: 3.5,
      visceral: 5,
      metabolicAge: 26,
      adherence: 95,
    },
  ];

  await Promise.all(
    iaCohort.map(async (p) => {
      const patient = await prisma.patient.create({
        data: {
          tenantId: mobileTenant.id,
          nutritionistId: mobileNutritionist.id,
          firstName: p.firstName,
          lastName: p.lastName,
          email: p.email,
          phone: null,
          birthDate: p.birthDate,
          gender: p.gender,
          status: PatientStatus.ACTIVE,
          heightCm: p.heightCm,
          nutritionGoal: p.nutritionGoal,
          clinicalNotes: p.clinicalNotes,
        },
      });

      // Medición previa (~90 días) y actual → habilita variacion_peso_3m_kg.
      await prisma.bodyMeasurement.create({
        data: {
          tenantId: mobileTenant.id,
          patientId: patient.id,
          registeredById: mobileNutritionist.id,
          measuredAt: daysAgo(90, 9, 0),
          weightKg: p.prevWeightKg,
          heightCm: p.heightCm,
          bmi: bmi(p.prevWeightKg, p.heightCm),
          waistCm: p.waistCm,
          hipCm: p.hipCm,
        },
      });

      const currentMeasurement = await prisma.bodyMeasurement.create({
        data: {
          tenantId: mobileTenant.id,
          patientId: patient.id,
          registeredById: mobileNutritionist.id,
          measuredAt: daysAgo(2, 9, 0),
          weightKg: p.weightKg,
          heightCm: p.heightCm,
          bmi: bmi(p.weightKg, p.heightCm),
          waistCm: p.waistCm,
          hipCm: p.hipCm,
        },
      });

      await prisma.bodyComposition.create({
        data: {
          tenantId: mobileTenant.id,
          patientId: patient.id,
          bodyMeasurementId: currentMeasurement.id,
          measuredAt: daysAgo(2, 9, 0),
          bodyFatPercentage: p.fat,
          muscleMassKg: p.muscle,
          waterPercentage: p.water,
          boneMassKg: p.bone,
          visceralFatLevel: p.visceral,
          metabolicAge: p.metabolicAge,
        },
      });

      // Plan activo con adherencia → habilita adherencia_dieta_pct en CU11.
      await prisma.dietPlan.create({
        data: {
          tenantId: mobileTenant.id,
          patientId: patient.id,
          nutritionistId: mobileNutritionist.id,
          name: `Plan ${p.firstName}`,
          objective: p.nutritionGoal,
          phase: 'Fase 1',
          approach: 'Plan personalizado',
          startDate: daysAgo(60),
          status: DietPlanStatus.ACTIVE,
          mealsPerDay: 4,
          estimatedCalories: p.gender === Gender.MALE ? 2000 : 1600,
          adherencePercent: p.adherence,
        },
      });

      // Cita completada → habilita asistencia_citas_pct.
      await prisma.appointment.create({
        data: {
          tenantId: mobileTenant.id,
          patientId: patient.id,
          nutritionistId: mobileNutritionist.id,
          scheduledAt: daysAgo(2, 11, 0),
          durationMinutes: 45,
          status: AppointmentStatus.COMPLETED,
          mode: AppointmentMode.IN_PERSON,
          reason: 'Evaluación inicial y toma de medidas',
          notes: 'Datos antropométricos registrados para análisis de IA.',
        },
      });
    }),
  );

  // ── 5. Resumen ──────────────────────────────────────────────────────────────
  console.log('\n✅ Seed completado exitosamente!\n');
  console.log('═══════════════════════════════════════════════════════════');
  console.log('   SUPER ADMIN        : super.admin@vitalbite.com / demo1234');
  console.log('   NUTRICIONISTA WEB  : elena.cruz@gmail.com / demo1234');
  console.log('   ADMIN WEB          : admin.central@vitalbite.com / demo1234');
  console.log('───────────────────────────────────────────────────────────');
  console.log('   PRUEBAS MÓVILES (slug: clinica-nutrifit)');
  console.log('   Paciente           : maria.gonzalez@vitalbite.com / demo1234');
  console.log('   Nutricionista      : elena.cruz@vitalbite.com / demo1234');
  console.log('═══════════════════════════════════════════════════════════\n');
}

main()
  .finally(async () => {
    await prisma.$disconnect();
  })
  .catch(async (error) => {
    console.error('❌ Error en seed:', error);
    await prisma.$disconnect();
    process.exit(1);
  });
