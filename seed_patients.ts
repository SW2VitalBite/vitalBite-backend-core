import 'dotenv/config';
import { PrismaPg } from '@prisma/adapter-pg';
import { PrismaClient } from './src/generated/prisma/client';

const databaseUrl = process.env.DATABASE_URL;
const adapter = new PrismaPg({ connectionString: databaseUrl! });
const prisma = new PrismaClient({ adapter });

async function main() {
  console.log('Buscando a la nutricionista Elena Cruz...');
  // Buscar a Elena
  const elena = await prisma.user.findFirst({
    where: {
      firstName: { contains: 'Elena' },
    },
  });

  if (!elena) {
    console.error('No se encontro a Elena Cruz en la BD.');
    return;
  }

  console.log(`Encontrada Elena Cruz con ID: ${elena.id}`);
  
  const tenantId = elena.tenantId;

  console.log('Generando 10 pacientes de prueba...');
  
  for (let i = 1; i <= 10; i++) {
    const age = Math.floor(Math.random() * (60 - 20 + 1)) + 20;
    const heightCm = Math.floor(Math.random() * (190 - 150 + 1)) + 150;
    const weightKg = Math.floor(Math.random() * (110 - 50 + 1)) + 50;
    const isMale = Math.random() > 0.5;
    const bmi = weightKg / Math.pow(heightCm / 100, 2);
    
    // Crear el paciente
    const patient = await prisma.patient.create({
      data: {
        tenantId,
        nutritionistId: elena.id,
        firstName: `Paciente${i}`,
        lastName: `Prueba Kmeans`,
        email: `paciente${i}_kmeans@test.com`,
        phone: `5917000000${i}`,
        birthDate: new Date(new Date().getFullYear() - age, 1, 1),
        gender: isMale ? 'MALE' : 'FEMALE',
        heightCm,
        activityLevel: Math.floor(Math.random() * 5) + 1,
        dietQualityScore: Math.random() * 10,
        status: 'ACTIVE',
      }
    });

    // Añadir una medida corporal para que la IA tenga datos
    const measurement = await prisma.bodyMeasurement.create({
      data: {
        tenantId,
        patientId: patient.id,
        registeredById: elena.id,
        measuredAt: new Date(),
        weightKg,
        heightCm,
        bmi,
        waistCm: isMale ? Math.floor(Math.random() * (110 - 80 + 1)) + 80 : Math.floor(Math.random() * (95 - 65 + 1)) + 65,
        hipCm: isMale ? Math.floor(Math.random() * (110 - 90 + 1)) + 90 : Math.floor(Math.random() * (120 - 85 + 1)) + 85,
      }
    });

    // Añadir composición corporal
    await prisma.bodyComposition.create({
      data: {
        tenantId,
        patientId: patient.id,
        bodyMeasurementId: measurement.id,
        measuredAt: new Date(),
        bodyFatPercentage: isMale ? Math.random() * (30 - 10) + 10 : Math.random() * (40 - 15) + 15,
        muscleMassKg: isMale ? Math.random() * (45 - 30) + 30 : Math.random() * (30 - 20) + 20,
        waterPercentage: Math.random() * (65 - 45) + 45,
        metabolicAge: age + Math.floor(Math.random() * 10) - 5,
      }
    });

    console.log(`Paciente ${i} creado con exito (ID: ${patient.id}) con sus medidas corporales.`);
  }

  console.log('¡Proceso finalizado! Ya tienes 10 pacientes nuevos con datos.');
}

main()
  .catch(e => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
