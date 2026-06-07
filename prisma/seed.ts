import 'dotenv/config';
import { PrismaPg } from '@prisma/adapter-pg';
import { hashSync } from 'bcryptjs';
import {
  AppointmentMode,
  AppointmentStatus,
  Gender,
  MealType,
  NotificationType,
  PatientStatus,
  PrismaClient,
  TenantStatus,
  UserStatus,
} from '../src/generated/prisma/client';

const databaseUrl = process.env.DATABASE_URL;

if (!databaseUrl) {
  throw new Error('DATABASE_URL es requerido para poblar la base de datos.');
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
  await prisma.dietItem.deleteMany();
  await prisma.dietMeal.deleteMany();
  await prisma.diet.deleteMany();
  await prisma.bodyComposition.deleteMany();
  await prisma.bodyMeasurement.deleteMany();
  await prisma.appointment.deleteMany();
  await prisma.patient.deleteMany();
  await prisma.user.deleteMany();
  await prisma.tenant.deleteMany();

  // ── 2. Tenant ───────────────────────────────────────────────────────────────
  console.log('🏥 Creando consultorio...');

  const tenant = await prisma.tenant.create({
    data: {
      name: 'Clínica NutriFit',
      slug: 'clinica-nutrifit',
      status: TenantStatus.ACTIVE,
    },
  });

  console.log(`   Código de consultorio: ${tenant.slug}`);

  // ── 3. Usuarios ─────────────────────────────────────────────────────────────
  console.log('👩‍⚕️ Creando nutricionista y administrador...');

  const nutritionist = await prisma.user.create({
    data: {
      tenantId: tenant.id,
      email: 'elena.cruz@vitalbite.com',
      passwordHash: hashSync('demo1234', 10),
      firstName: 'Elena',
      lastName: 'Cruz',
      status: UserStatus.ACTIVE,
      roleCode: 'NUTRICIONISTA',
    },
  });

  await prisma.user.create({
    data: {
      tenantId: tenant.id,
      email: 'admin@vitalbite.com',
      passwordHash: hashSync('demo1234', 10),
      firstName: 'Valeria',
      lastName: 'Mendoza',
      status: UserStatus.ACTIVE,
      roleCode: 'ADMINISTRADOR',
    },
  });

  // ── 4. Paciente principal para pruebas móviles ──────────────────────────────
  // Credenciales: maria.gonzalez@vitalbite.com / demo1234
  console.log('📱 Creando paciente principal para pruebas móviles...');

  const maria = await prisma.patient.create({
    data: {
      tenantId: tenant.id,
      nutritionistId: nutritionist.id,
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

  // ── 5. Pacientes secundarios (para vista de nutricionista) ──────────────────
  console.log('👥 Creando pacientes secundarios...');

  const [ana, luis, marta, carlos, sofia] = await Promise.all([
    prisma.patient.create({
      data: {
        tenantId: tenant.id,
        nutritionistId: nutritionist.id,
        firstName: 'Ana',
        lastName: 'Rojas',
        email: 'ana.rojas@email.com',
        passwordHash: hashSync('demo1234', 10),
        phone: '70012345',
        birthDate: new Date('1992-05-14T00:00:00.000Z'),
        gender: Gender.FEMALE,
        status: PatientStatus.ACTIVE,
        nutritionGoal: 'Bajar grasa corporal',
        clinicalNotes: 'Revisar distribución de comidas.',
        heightCm: 162,
      },
    }),
    prisma.patient.create({
      data: {
        tenantId: tenant.id,
        nutritionistId: nutritionist.id,
        firstName: 'Luis',
        lastName: 'Pinto',
        email: 'luis.pinto@email.com',
        passwordHash: hashSync('demo1234', 10),
        phone: '70123456',
        birthDate: new Date('1988-09-22T00:00:00.000Z'),
        gender: Gender.MALE,
        status: PatientStatus.ACTIVE,
        nutritionGoal: 'Ganar masa muscular',
        clinicalNotes: 'Priorizar proteínas y entrenamiento.',
        heightCm: 178,
      },
    }),
    prisma.patient.create({
      data: {
        tenantId: tenant.id,
        nutritionistId: nutritionist.id,
        firstName: 'Marta',
        lastName: 'Silva',
        email: 'marta.silva@email.com',
        passwordHash: hashSync('demo1234', 10),
        phone: '70234567',
        birthDate: new Date('1979-03-08T00:00:00.000Z'),
        gender: Gender.FEMALE,
        status: PatientStatus.INACTIVE,
        nutritionGoal: 'Control glucosa',
        clinicalNotes: 'Seguimiento cercano de carga glucémica.',
        heightCm: 160,
      },
    }),
    prisma.patient.create({
      data: {
        tenantId: tenant.id,
        nutritionistId: nutritionist.id,
        firstName: 'Carlos',
        lastName: 'Meza',
        email: 'carlos.meza@email.com',
        passwordHash: hashSync('demo1234', 10),
        phone: '70345678',
        birthDate: new Date('1985-11-17T00:00:00.000Z'),
        gender: Gender.MALE,
        status: PatientStatus.ACTIVE,
        nutritionGoal: 'Mantener peso',
        clinicalNotes: 'Evolución estable. Controles mensuales.',
        heightCm: 174,
      },
    }),
    prisma.patient.create({
      data: {
        tenantId: tenant.id,
        nutritionistId: nutritionist.id,
        firstName: 'Sofía',
        lastName: 'Arias',
        email: 'sofia.arias@email.com',
        passwordHash: hashSync('demo1234', 10),
        phone: '70456789',
        birthDate: new Date('1997-07-30T00:00:00.000Z'),
        gender: Gender.FEMALE,
        status: PatientStatus.ACTIVE,
        nutritionGoal: 'Reducir cintura',
        clinicalNotes: 'Validar medidas y ajustar plan.',
        heightCm: 158,
      },
    }),
  ]);

  // ── 6. Mediciones corporales — María (historial de 6 meses) ────────────────
  console.log('📊 Creando historial de mediciones corporales para María...');

  const mariaMeasData = [
    { daysBack: 175, weightKg: 74.0, waistCm: 85, hipCm: 100 }, // ~dic 2025
    { daysBack: 145, weightKg: 72.8, waistCm: 83, hipCm: 99 },  // ~ene 2026
    { daysBack: 115, weightKg: 71.5, waistCm: 81, hipCm: 98 },  // ~feb 2026
    { daysBack: 85,  weightKg: 70.2, waistCm: 79, hipCm: 97 },  // ~mar 2026
    { daysBack: 55,  weightKg: 68.5, waistCm: 77, hipCm: 96 },  // ~abr 2026
    { daysBack: 20,  weightKg: 67.2, waistCm: 75, hipCm: 95 },  // ~may 2026
    { daysBack: 0,   weightKg: 66.8, waistCm: 74, hipCm: 94 },  // hoy
  ];

  const mariaMeasurements = await Promise.all(
    mariaMeasData.map((m) =>
      prisma.bodyMeasurement.create({
        data: {
          tenantId: tenant.id,
          patientId: maria.id,
          registeredById: nutritionist.id,
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

  // ── 7. Composición corporal — María (mismo historial) ──────────────────────
  console.log('🧬 Creando historial de composición corporal para María...');

  const mariaCompData = [
    { daysBack: 175, fat: 28.2, muscle: 25.0, water: 52.0, bone: 2.6, visceral: 8, age: 32 },
    { daysBack: 145, fat: 27.0, muscle: 25.4, water: 52.8, bone: 2.6, visceral: 7, age: 32 },
    { daysBack: 115, fat: 25.8, muscle: 25.9, water: 53.5, bone: 2.7, visceral: 7, age: 31 },
    { daysBack: 85,  fat: 24.6, muscle: 26.4, water: 54.1, bone: 2.7, visceral: 6, age: 31 },
    { daysBack: 55,  fat: 23.5, muscle: 26.9, water: 54.8, bone: 2.7, visceral: 6, age: 30 },
    { daysBack: 20,  fat: 22.4, muscle: 27.4, water: 55.4, bone: 2.8, visceral: 5, age: 30 },
    { daysBack: 0,   fat: 21.8, muscle: 27.8, water: 55.9, bone: 2.8, visceral: 5, age: 29 },
  ];

  await Promise.all(
    mariaCompData.map((c, i) =>
      prisma.bodyComposition.create({
        data: {
          tenantId: tenant.id,
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

  // ── 8. Mediciones de pacientes secundarios ──────────────────────────────────
  console.log('📏 Creando mediciones de pacientes secundarios...');

  await Promise.all([
    prisma.bodyMeasurement.create({
      data: {
        tenantId: tenant.id, patientId: ana.id, registeredById: nutritionist.id,
        measuredAt: daysAgo(5, 10, 0), weightKg: 68.4, heightCm: 162,
        bmi: bmi(68.4, 162), waistCm: 86, hipCm: 100,
      },
    }),
    prisma.bodyMeasurement.create({
      data: {
        tenantId: tenant.id, patientId: luis.id, registeredById: nutritionist.id,
        measuredAt: daysAgo(3, 11, 0), weightKg: 74.2, heightCm: 178,
        bmi: bmi(74.2, 178), waistCm: 82, hipCm: 96,
      },
    }),
    prisma.bodyMeasurement.create({
      data: {
        tenantId: tenant.id, patientId: carlos.id, registeredById: nutritionist.id,
        measuredAt: daysAgo(8, 14, 0), weightKg: 79.1, heightCm: 174,
        bmi: bmi(79.1, 174), waistCm: 88, hipCm: 99,
      },
    }),
  ]);

  // ── 9. Citas — María (historial completo + próximas) ───────────────────────
  console.log('📅 Creando citas para María...');

  await Promise.all([
    // Próximas
    prisma.appointment.create({
      data: {
        tenantId: tenant.id,
        patientId: maria.id,
        nutritionistId: nutritionist.id,
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
        tenantId: tenant.id,
        patientId: maria.id,
        nutritionistId: nutritionist.id,
        scheduledAt: daysFromNow(12, 14, 30),
        durationMinutes: 30,
        status: AppointmentStatus.CONFIRMED,
        mode: AppointmentMode.VIRTUAL,
        reason: 'Revisión de composición corporal',
        notes: 'Traer registro de comidas de la semana.',
      },
    }),
    // Completadas
    prisma.appointment.create({
      data: {
        tenantId: tenant.id,
        patientId: maria.id,
        nutritionistId: nutritionist.id,
        scheduledAt: daysAgo(8, 10, 0),
        durationMinutes: 45,
        status: AppointmentStatus.COMPLETED,
        mode: AppointmentMode.IN_PERSON,
        reason: 'Seguimiento de plan de dieta',
        notes: 'Paciente reporta buena tolerancia. Peso bajó 1.3 kg. Se mantiene el plan.',
      },
    }),
    prisma.appointment.create({
      data: {
        tenantId: tenant.id,
        patientId: maria.id,
        nutritionistId: nutritionist.id,
        scheduledAt: daysAgo(38, 9, 30),
        durationMinutes: 45,
        status: AppointmentStatus.COMPLETED,
        mode: AppointmentMode.IN_PERSON,
        reason: 'Control mensual',
        notes: 'Bajó 1.7 kg respecto al mes anterior. Composición mejoró notablemente.',
      },
    }),
    prisma.appointment.create({
      data: {
        tenantId: tenant.id,
        patientId: maria.id,
        nutritionistId: nutritionist.id,
        scheduledAt: daysAgo(68, 11, 0),
        durationMinutes: 45,
        status: AppointmentStatus.COMPLETED,
        mode: AppointmentMode.IN_PERSON,
        reason: 'Control mensual — ajuste de fase',
        notes: 'Transición a Fase 2 del plan. Incrementar proteínas en almuerzo.',
      },
    }),
    // Cancelada
    prisma.appointment.create({
      data: {
        tenantId: tenant.id,
        patientId: maria.id,
        nutritionistId: nutritionist.id,
        scheduledAt: daysAgo(95, 15, 0),
        durationMinutes: 30,
        status: AppointmentStatus.CANCELLED,
        mode: AppointmentMode.VIRTUAL,
        reason: 'Revisión rápida de plan',
        cancelReason: 'Paciente canceló por compromisos laborales. Reprogramada para la semana siguiente.',
        deletedAt: daysAgo(96, 8, 0),
      },
    }),
    // No show
    prisma.appointment.create({
      data: {
        tenantId: tenant.id,
        patientId: maria.id,
        nutritionistId: nutritionist.id,
        scheduledAt: daysAgo(125, 10, 0),
        durationMinutes: 45,
        status: AppointmentStatus.NO_SHOW,
        mode: AppointmentMode.IN_PERSON,
        reason: 'Control de inicio de tratamiento',
        notes: 'Paciente no se presentó. Se reagendó la siguiente semana.',
      },
    }),
  ]);

  // ── 10. Citas de pacientes secundarios ─────────────────────────────────────
  console.log('📅 Creando citas de pacientes secundarios...');

  await Promise.all([
    prisma.appointment.create({
      data: {
        tenantId: tenant.id, patientId: ana.id, nutritionistId: nutritionist.id,
        scheduledAt: daysFromNow(3, 14, 30), durationMinutes: 45,
        status: AppointmentStatus.CONFIRMED, mode: AppointmentMode.IN_PERSON,
        reason: 'Control de medidas y adherencia',
      },
    }),
    prisma.appointment.create({
      data: {
        tenantId: tenant.id, patientId: luis.id, nutritionistId: nutritionist.id,
        scheduledAt: daysAgo(2, 15, 0), durationMinutes: 45,
        status: AppointmentStatus.COMPLETED, mode: AppointmentMode.IN_PERSON,
        reason: 'Seguimiento de masa muscular',
        notes: 'Incremento de 0.5 kg de masa muscular. Continuar plan.',
      },
    }),
    prisma.appointment.create({
      data: {
        tenantId: tenant.id, patientId: marta.id, nutritionistId: nutritionist.id,
        scheduledAt: daysAgo(5, 13, 30), durationMinutes: 45,
        status: AppointmentStatus.COMPLETED, mode: AppointmentMode.IN_PERSON,
        reason: 'Control glucosa y adherencia',
      },
    }),
    prisma.appointment.create({
      data: {
        tenantId: tenant.id, patientId: carlos.id, nutritionistId: nutritionist.id,
        scheduledAt: daysFromNow(7, 16, 0), durationMinutes: 30,
        status: AppointmentStatus.SCHEDULED, mode: AppointmentMode.IN_PERSON,
        reason: 'Mantenimiento de peso mensual',
      },
    }),
    prisma.appointment.create({
      data: {
        tenantId: tenant.id, patientId: sofia.id, nutritionistId: nutritionist.id,
        scheduledAt: daysAgo(7, 12, 0), durationMinutes: 45,
        status: AppointmentStatus.RESCHEDULED, mode: AppointmentMode.IN_PERSON,
        reason: 'Revisión de cintura y reducción de medidas',
      },
    }),
  ]);

  // ── 11. Dieta activa para María ─────────────────────────────────────────────
  console.log('🥗 Creando plan de alimentación activo para María...');

  const diet = await prisma.diet.create({
    data: {
      tenantId: tenant.id,
      patientId: maria.id,
      nutritionistId: nutritionist.id,
      name: 'Plan Balance — Fase 2',
      objective: 'Pérdida de grasa sostenida con preservación de masa muscular. Meta: 64 kg en 3 meses.',
      startDate: daysAgo(20),
      isActive: true,
      meals: {
        create: [
          {
            mealType: MealType.DESAYUNO,
            name: 'Desayuno',
            items: {
              create: [
                { name: 'Avena cocida', quantity: 80, unit: 'g', calories: 290, protein: 10, carbs: 52, fat: 5 },
                { name: 'Banana mediana', quantity: 1, unit: 'unidad (120g)', calories: 90, protein: 1, carbs: 23, fat: 0.3 },
                { name: 'Leche descremada', quantity: 200, unit: 'ml', calories: 70, protein: 7, carbs: 10, fat: 0.5 },
                { name: 'Nueces', quantity: 15, unit: 'g', calories: 98, protein: 2, carbs: 2, fat: 10 },
              ],
            },
          },
          {
            mealType: MealType.ALMUERZO,
            name: 'Almuerzo',
            items: {
              create: [
                { name: 'Pechuga de pollo a la plancha', quantity: 150, unit: 'g', calories: 248, protein: 47, carbs: 0, fat: 5 },
                { name: 'Arroz integral cocido', quantity: 150, unit: 'g', calories: 165, protein: 4, carbs: 34, fat: 1.5 },
                { name: 'Brócoli al vapor', quantity: 150, unit: 'g', calories: 51, protein: 5, carbs: 9, fat: 0.5 },
                { name: 'Ensalada verde mixta', quantity: 100, unit: 'g', calories: 20, protein: 1, carbs: 3, fat: 0.2 },
                { name: 'Aceite de oliva extra virgen', quantity: 5, unit: 'ml', calories: 44, protein: 0, carbs: 0, fat: 5 },
              ],
            },
          },
          {
            mealType: MealType.MERIENDA,
            name: 'Merienda',
            items: {
              create: [
                { name: 'Almendras naturales', quantity: 30, unit: 'g', calories: 173, protein: 6, carbs: 6, fat: 15 },
                { name: 'Manzana verde', quantity: 1, unit: 'unidad (150g)', calories: 78, protein: 0, carbs: 21, fat: 0.2 },
                { name: 'Yogur griego sin azúcar', quantity: 100, unit: 'g', calories: 59, protein: 10, carbs: 3.6, fat: 0.4 },
              ],
            },
          },
          {
            mealType: MealType.CENA,
            name: 'Cena',
            items: {
              create: [
                { name: 'Salmón al horno', quantity: 120, unit: 'g', calories: 218, protein: 24, carbs: 0, fat: 13 },
                { name: 'Camote asado', quantity: 100, unit: 'g', calories: 86, protein: 2, carbs: 20, fat: 0.1 },
                { name: 'Espárragos a la plancha', quantity: 150, unit: 'g', calories: 34, protein: 4, carbs: 6, fat: 0.2 },
                { name: 'Jugo de limón', quantity: 30, unit: 'ml', calories: 8, protein: 0, carbs: 2, fat: 0 },
              ],
            },
          },
        ],
      },
    },
  });

  // Dieta inactiva (historial)
  await prisma.diet.create({
    data: {
      tenantId: tenant.id,
      patientId: maria.id,
      nutritionistId: nutritionist.id,
      name: 'Plan Balance — Fase 1',
      objective: 'Reducción de hábitos alimenticios desordenados. Introducción a macronutrientes.',
      startDate: daysAgo(80),
      endDate: daysAgo(21),
      isActive: false,
      meals: {
        create: [
          {
            mealType: MealType.DESAYUNO,
            items: { create: [{ name: 'Tostadas integrales', quantity: 2, unit: 'rebanadas', calories: 140, protein: 5, carbs: 28, fat: 2 }] },
          },
          {
            mealType: MealType.ALMUERZO,
            items: { create: [{ name: 'Pollo a la plancha', quantity: 120, unit: 'g', calories: 200, protein: 38, carbs: 0, fat: 4 }] },
          },
          {
            mealType: MealType.CENA,
            items: { create: [{ name: 'Sopa de verduras', quantity: 300, unit: 'ml', calories: 80, protein: 3, carbs: 14, fat: 1 }] },
          },
        ],
      },
    },
  });

  // Dieta activa para Luis (para demos del panel nutricionista)
  await prisma.diet.create({
    data: {
      tenantId: tenant.id,
      patientId: luis.id,
      nutritionistId: nutritionist.id,
      name: 'Plan Hipertrofia — Fase 1',
      objective: 'Aumento de masa muscular. Surplus calórico controlado.',
      startDate: daysAgo(15),
      isActive: true,
      meals: {
        create: [
          {
            mealType: MealType.DESAYUNO,
            items: {
              create: [
                { name: 'Huevos revueltos', quantity: 3, unit: 'unidades', calories: 210, protein: 18, carbs: 1, fat: 15 },
                { name: 'Pan integral', quantity: 2, unit: 'rebanadas', calories: 140, protein: 5, carbs: 28, fat: 2 },
                { name: 'Aguacate', quantity: 50, unit: 'g', calories: 80, protein: 1, carbs: 3, fat: 7 },
              ],
            },
          },
          {
            mealType: MealType.ALMUERZO,
            items: {
              create: [
                { name: 'Carne de res magra', quantity: 180, unit: 'g', calories: 296, protein: 54, carbs: 0, fat: 8 },
                { name: 'Arroz blanco', quantity: 200, unit: 'g', calories: 260, protein: 5, carbs: 57, fat: 0.5 },
              ],
            },
          },
          {
            mealType: MealType.CENA,
            items: {
              create: [
                { name: 'Batido de proteína de suero', quantity: 1, unit: 'porción (30g polvo)', calories: 120, protein: 25, carbs: 3, fat: 1 },
                { name: 'Avena', quantity: 60, unit: 'g', calories: 216, protein: 8, carbs: 39, fat: 4 },
              ],
            },
          },
        ],
      },
    },
  });

  // ── 12. Notificaciones para María ───────────────────────────────────────────
  console.log('🔔 Creando notificaciones para María...');

  await prisma.notification.createMany({
    data: [
      // No leídas (recientes)
      {
        tenantId: tenant.id,
        patientId: maria.id,
        type: NotificationType.DIETA_ASIGNADA,
        title: 'Nueva dieta asignada',
        body: 'Tu nutricionista ha asignado un nuevo plan de alimentación: Plan Balance — Fase 2.',
        data: { dietId: diet.id },
        isRead: false,
        createdAt: daysAgo(0, 8, 15),
      },
      {
        tenantId: tenant.id,
        patientId: maria.id,
        type: NotificationType.CITA_CREADA,
        title: 'Cita programada',
        body: `Tu cita con Elena Cruz está confirmada para dentro de 5 días a las 10:00.`,
        data: {},
        isRead: false,
        createdAt: daysAgo(0, 8, 10),
      },
      {
        tenantId: tenant.id,
        patientId: maria.id,
        type: NotificationType.MENSAJE,
        title: 'Mensaje de tu nutricionista',
        body: 'Hola María, recuerda aumentar tu consumo de agua a 2.5L diarios esta semana.',
        data: {},
        isRead: false,
        createdAt: daysAgo(1, 17, 30),
      },
      // Leídas (más antiguas)
      {
        tenantId: tenant.id,
        patientId: maria.id,
        type: NotificationType.CITA_CONFIRMADA,
        title: 'Cita confirmada',
        body: 'Tu cita de revisión mensual ha sido confirmada por tu nutricionista.',
        data: {},
        isRead: true,
        createdAt: daysAgo(8, 9, 45),
      },
      {
        tenantId: tenant.id,
        patientId: maria.id,
        type: NotificationType.CITA_REPROGRAMADA,
        title: 'Cita reprogramada',
        body: 'Tu cita ha sido reprogramada para el próximo jueves a las 10:00.',
        data: {},
        isRead: true,
        createdAt: daysAgo(38, 14, 0),
      },
      {
        tenantId: tenant.id,
        patientId: maria.id,
        type: NotificationType.REPORTE,
        title: 'Reporte mensual disponible',
        body: 'Tu informe de progreso de mayo está listo. Bajaste 1.7 kg este mes. ¡Excelente trabajo!',
        data: {},
        isRead: true,
        createdAt: daysAgo(38, 10, 0),
      },
      {
        tenantId: tenant.id,
        patientId: maria.id,
        type: NotificationType.DIETA_ASIGNADA,
        title: 'Nueva dieta asignada',
        body: 'Tu nutricionista ha asignado un plan de alimentación: Plan Balance — Fase 1.',
        data: {},
        isRead: true,
        createdAt: daysAgo(80, 11, 0),
      },
      {
        tenantId: tenant.id,
        patientId: maria.id,
        type: NotificationType.CITA_CANCELADA,
        title: 'Cita cancelada',
        body: 'Tu cita fue cancelada. Motivo: Paciente canceló por compromisos laborales.',
        data: {},
        isRead: true,
        createdAt: daysAgo(95, 15, 10),
      },
    ],
  });

  // ── 13. Resumen ─────────────────────────────────────────────────────────────
  console.log('\n✅ Seed completado exitosamente!\n');
  console.log('═══════════════════════════════════════════════════════════');
  console.log('   CREDENCIALES PARA PRUEBAS MÓVILES                      ');
  console.log('═══════════════════════════════════════════════════════════');
  console.log('   Código de consultorio : clinica-nutrifit               ');
  console.log('   Paciente (mobile)     : maria.gonzalez@vitalbite.com   ');
  console.log('   Contraseña            : demo1234                       ');
  console.log('───────────────────────────────────────────────────────────');
  console.log('   CREDENCIALES PANEL WEB / GRAPHQL                       ');
  console.log('───────────────────────────────────────────────────────────');
  console.log('   Nutricionista  : elena.cruz@vitalbite.com / demo1234   ');
  console.log('   Administrador  : admin@vitalbite.com / demo1234        ');
  console.log('───────────────────────────────────────────────────────────');
  console.log('   DATOS DE MARÍA GONZÁLEZ                                ');
  console.log('───────────────────────────────────────────────────────────');
  console.log('   Mediciones corporales : 7 registros (últimos 6 meses)  ');
  console.log('   Composición corporal  : 7 registros (mismas fechas)    ');
  console.log('   Citas                 : 7 (2 próximas, 3 completadas,  ');
  console.log('                              1 cancelada, 1 no show)     ');
  console.log('   Dieta activa          : Plan Balance — Fase 2          ');
  console.log('                          4 comidas, 17 alimentos         ');
  console.log('   Notificaciones        : 8 (3 no leídas, 5 leídas)     ');
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
