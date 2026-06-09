import { PrismaClient } from '../src/prisma/generated-client';
import { Pool } from 'pg';
import { PrismaPg } from '@prisma/adapter-pg';

const connectionString = 'postgresql://postgres:alvarorionuevo15@localhost:5432/vitalbite_core';
const pool = new Pool({ connectionString });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

async function main() {
  const tenants = await prisma.tenant.findMany();
  
  if (tenants.length === 0) {
    console.error('No hay Tenants en la base de datos.');
    return;
  }

  let totalCount = 0;

  for (const tenant of tenants) {
    const nutritionist = await prisma.user.findFirst({
      where: { 
        tenantId: tenant.id,
        roleCode: { in: ['NUTRICIONISTA', 'ADMINISTRADOR', 'ADMIN'] } 
      },
    });

    if (!nutritionist) {
      console.log(`Saltando Tenant ${tenant.id}: No tiene nutricionista asignado.`);
      continue;
    }

    console.log(`Insertando en Tenant ID: ${tenant.id} | Nutritionist: ${nutritionist.id}`);

    const mockPatients = [
      { weight: 95, height: 165, fat: 38, muscle: 28, varPeso: 3.5, activity: 0, adherence: 20 },
      { weight: 102, height: 170, fat: 42, muscle: 30, varPeso: 4.2, activity: 0, adherence: 15 },
      { weight: 88, height: 160, fat: 35, muscle: 25, varPeso: 2.1, activity: 1, adherence: 30 },
      { weight: 75, height: 180, fat: 12, muscle: 42, varPeso: -0.5, activity: 4, adherence: 90 },
      { weight: 82, height: 185, fat: 14, muscle: 45, varPeso: -1.2, activity: 4, adherence: 85 },
      { weight: 68, height: 172, fat: 15, muscle: 36, varPeso: -0.8, activity: 3, adherence: 88 },
      { weight: 65, height: 165, fat: 22, muscle: 24, varPeso: 0.2, activity: 2, adherence: 60 },
      { weight: 70, height: 175, fat: 20, muscle: 28, varPeso: -0.1, activity: 2, adherence: 70 },
      { weight: 62, height: 160, fat: 24, muscle: 22, varPeso: 0.5, activity: 2, adherence: 65 },
      { weight: 90, height: 178, fat: 28, muscle: 35, varPeso: 1.5, activity: 1, adherence: 40 },
    ];

    for (const [i, mock] of mockPatients.entries()) {
      const patient = await prisma.patient.create({
        data: {
          tenantId: tenant.id,
          nutritionistId: nutritionist.id,
          firstName: `Paciente ${i + 1}`,
          lastName: 'Prueba KMeans',
          email: `paciente${tenant.id.substring(0,4)}${i + 1}@vitalbite.local`,
          activityLevel: mock.activity,
          status: 'ACTIVE',
        },
      });

      const measurement = await prisma.bodyMeasurement.create({
        data: {
          tenantId: tenant.id,
          patientId: patient.id,
          registeredById: nutritionist.id,
          measuredAt: new Date(),
          weightKg: mock.weight,
          heightCm: mock.height,
          bmi: mock.weight / Math.pow(mock.height / 100, 2),
        },
      });

      await prisma.bodyMeasurement.create({
        data: {
          tenantId: tenant.id,
          patientId: patient.id,
          registeredById: nutritionist.id,
          measuredAt: new Date(Date.now() - 90 * 24 * 60 * 60 * 1000),
          weightKg: mock.weight - mock.varPeso,
          heightCm: mock.height,
          bmi: (mock.weight - mock.varPeso) / Math.pow(mock.height / 100, 2),
        },
      });

      await prisma.bodyComposition.create({
        data: {
          tenantId: tenant.id,
          patientId: patient.id,
          bodyMeasurementId: measurement.id,
          measuredAt: new Date(),
          bodyFatPercentage: mock.fat,
          muscleMassKg: mock.muscle,
        },
      });

      await prisma.dietPlan.create({
        data: {
          tenantId: tenant.id,
          patientId: patient.id,
          nutritionistId: nutritionist.id,
          name: `Plan Nutricional ${i + 1}`,
          objective: 'Mantenimiento / Prueba',
          status: 'ACTIVE',
          adherencePercent: mock.adherence,
        },
      });

      totalCount++;
    }
  }

  console.log(`✅ ¡Se han insertado ${totalCount} pacientes de prueba exitosamente!`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
