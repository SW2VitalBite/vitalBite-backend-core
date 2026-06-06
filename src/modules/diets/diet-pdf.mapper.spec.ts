import { DietPlanStatus } from '../../prisma/generated-client';
import { mapDietPlanToPdfPayload } from './diet-pdf.mapper';
import { DietPlanModel } from './models/diet-plan.model';

describe('mapDietPlanToPdfPayload', () => {
  it('maps a diet plan into the Spring Boot PDF payload', () => {
    const payload = mapDietPlanToPdfPayload(buildDietPlan(), {
      requestId: 'req-001',
      generatedAt: new Date('2026-06-06T12:00:00.000Z'),
    });

    expect(payload.requestId).toBe('req-001');
    expect(payload.output.fileName).toBe('dieta-semanal-ana-rojas-semana-4.pdf');
    expect(payload.patient.fullName).toBe('Ana Rojas');
    expect(payload.dietPlan.dailyCaloriesTarget).toBe(1570);
    expect(payload.week.days[0].targetCalories).toBe(980);
    expect(payload.week.days[0].consumedCalories).toBe(980);
    expect(payload.week.days[0].meals[0].time).toBe('08:00');
    expect(payload.week.days[0].meals[0].text).toBe(
      'Avena cocida 1 taza + Huevos revueltos 2 unidades + Cafe o infusion 1 taza',
    );
    expect(payload.summary.weeklyTargetCalories).toBe(1390);
    expect(payload.summary.weeklyConsumedCalories).toBe(1390);
  });

  it('handles empty meals without inventing foods', () => {
    const dietPlan = buildDietPlan();
    dietPlan.days[0].meals[1].items = [];

    const payload = mapDietPlanToPdfPayload(dietPlan);

    expect(payload.week.days[0].meals[1].consumedCalories).toBe(0);
    expect(payload.week.days[0].meals[1].text).toBe('Sin alimentos registrados');
  });
});

function buildDietPlan(): DietPlanModel {
  return {
    id: 'diet-001',
    tenantId: 'tenant-001',
    patientId: 'patient-001',
    nutritionistId: 'nutritionist-001',
    name: 'Plan antiinflamatorio',
    objective: 'Reducir inflamacion y mejorar adherencia',
    phase: 'Semana 4',
    approach: 'Alta proteina',
    startDate: new Date('2026-06-09T00:00:00.000Z'),
    endDate: new Date('2026-06-15T00:00:00.000Z'),
    status: DietPlanStatus.ACTIVE,
    mealsPerDay: 4,
    mainRestriction: 'Sin bebidas azucaradas',
    notes: 'Tomar agua durante el dia',
    estimatedCalories: 1570,
    adherencePercent: 88,
    patientFullName: 'Ana Rojas',
    nutritionistFullName: 'Dra. Carla Mendoza',
    createdAt: new Date('2026-06-01T00:00:00.000Z'),
    updatedAt: new Date('2026-06-06T00:00:00.000Z'),
    days: [
      {
        id: 'day-001',
        dietPlanId: 'diet-001',
        dayLabel: 'Lunes',
        dayOrder: 1,
        createdAt: new Date('2026-06-01T00:00:00.000Z'),
        updatedAt: new Date('2026-06-06T00:00:00.000Z'),
        meals: [
          {
            id: 'meal-001',
            dietPlanDayId: 'day-001',
            name: 'Desayuno',
            mealOrder: 1,
            targetCalories: 420,
            notes: '08:00',
            createdAt: new Date('2026-06-01T00:00:00.000Z'),
            updatedAt: new Date('2026-06-06T00:00:00.000Z'),
            items: [
              buildItem('item-001', 'meal-001', 'Avena cocida', '1 taza', 150, 1),
              buildItem('item-002', 'meal-001', 'Huevos revueltos', '2 unidades', 180, 2),
              buildItem('item-003', 'meal-001', 'Cafe o infusion', '1 taza', 90, 3),
            ],
          },
          {
            id: 'meal-002',
            dietPlanDayId: 'day-001',
            name: 'Almuerzo',
            mealOrder: 2,
            targetCalories: 560,
            notes: '12:30',
            createdAt: new Date('2026-06-01T00:00:00.000Z'),
            updatedAt: new Date('2026-06-06T00:00:00.000Z'),
            items: [
              buildItem('item-004', 'meal-002', 'Pollo grillado', '140 g', 240, 1),
              buildItem('item-005', 'meal-002', 'Quinoa cocida', '3/4 taza', 170, 2),
              buildItem('item-006', 'meal-002', 'Ensalada', '1 plato', 150, 3),
            ],
          },
        ],
      },
      {
        id: 'day-002',
        dietPlanId: 'diet-001',
        dayLabel: 'Martes',
        dayOrder: 2,
        createdAt: new Date('2026-06-01T00:00:00.000Z'),
        updatedAt: new Date('2026-06-06T00:00:00.000Z'),
        meals: [
          {
            id: 'meal-003',
            dietPlanDayId: 'day-002',
            name: 'Desayuno',
            mealOrder: 1,
            targetCalories: 410,
            notes: '08:00',
            createdAt: new Date('2026-06-01T00:00:00.000Z'),
            updatedAt: new Date('2026-06-06T00:00:00.000Z'),
            items: [buildItem('item-007', 'meal-003', 'Porridge de avena', '1 porcion', 410, 1)],
          },
        ],
      },
    ],
  };
}

function buildItem(
  id: string,
  dietMealId: string,
  name: string,
  portion: string,
  calories: number,
  itemOrder: number,
) {
  return {
    id,
    dietMealId,
    name,
    portion,
    calories,
    itemOrder,
    notes: null,
    createdAt: new Date('2026-06-01T00:00:00.000Z'),
    updatedAt: new Date('2026-06-06T00:00:00.000Z'),
  };
}
