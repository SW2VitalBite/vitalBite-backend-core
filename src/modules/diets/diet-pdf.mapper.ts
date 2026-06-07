import { DietMealItemModel } from './models/diet-meal-item.model';
import { DietMealModel } from './models/diet-meal.model';
import { DietPlanDayModel } from './models/diet-plan-day.model';
import { DietPlanModel } from './models/diet-plan.model';

export interface DietPdfPayload {
  requestId: string;
  generatedAt: string;
  output: {
    format: 'PDF';
    delivery: 'BASE64' | 'BINARY' | 'URL';
    fileName: string;
    locale: string;
    timezone: string;
  };
  patient: {
    id: string;
    fullName: string;
  };
  nutritionist: {
    id: string;
    fullName: string;
  };
  dietPlan: {
    id: string;
    name: string;
    phase: string | null;
    objective: string;
    approach: string | null;
    status: string;
    startDate: string | null;
    endDate: string | null;
    dailyCaloriesTarget: number;
    mealsPerDay: number;
    mainRestriction: string | null;
    notes: string | null;
  };
  week: {
    days: DietPdfDay[];
  };
  summary: {
    weeklyTargetCalories: number;
    weeklyConsumedCalories: number;
    daysCount: number;
  };
  footer: {
    showGenerationDate: boolean;
    showProfessionalSignature: boolean;
    customText: string;
  };
}

export interface DietPdfDay {
  dayId: string;
  dayOrder: number;
  dayLabel: string;
  targetCalories: number;
  consumedCalories: number;
  meals: DietPdfMeal[];
}

export interface DietPdfMeal {
  mealId: string;
  mealOrder: number;
  mealLabel: string;
  time: string | null;
  targetCalories: number;
  consumedCalories: number;
  notes: string | null;
  items: DietPdfMealItem[];
  text: string;
}

export interface DietPdfMealItem {
  itemId: string;
  itemOrder: number;
  name: string;
  portion: string | null;
  calories: number;
  notes: string | null;
}

export interface MapDietPlanToPdfPayloadOptions {
  requestId?: string;
  generatedAt?: Date;
  delivery?: DietPdfPayload['output']['delivery'];
  locale?: string;
  timezone?: string;
  fileName?: string;
  showGenerationDate?: boolean;
  showProfessionalSignature?: boolean;
  footerText?: string;
}

export function mapDietPlanToPdfPayload(
  dietPlan: DietPlanModel,
  options: MapDietPlanToPdfPayloadOptions = {},
): DietPdfPayload {
  const generatedAt = options.generatedAt ?? new Date();
  const weekDays = [...(dietPlan.days ?? [])]
    .sort((current, next) => current.dayOrder - next.dayOrder)
    .map((day) => mapDay(day));

  return {
    requestId: options.requestId ?? `diet-pdf-${dietPlan.id}`,
    generatedAt: generatedAt.toISOString(),
    output: {
      format: 'PDF',
      delivery: options.delivery ?? 'BASE64',
      fileName: options.fileName ?? buildFileName(dietPlan),
      locale: options.locale ?? 'es-BO',
      timezone: options.timezone ?? 'America/La_Paz',
    },
    patient: {
      id: dietPlan.patientId,
      fullName: dietPlan.patientFullName,
    },
    nutritionist: {
      id: dietPlan.nutritionistId,
      fullName: dietPlan.nutritionistFullName,
    },
    dietPlan: {
      id: dietPlan.id,
      name: dietPlan.name,
      phase: dietPlan.phase ?? null,
      objective: dietPlan.objective,
      approach: dietPlan.approach ?? null,
      status: dietPlan.status,
      startDate: toIsoDate(dietPlan.startDate),
      endDate: toIsoDate(dietPlan.endDate),
      dailyCaloriesTarget: numberOrZero(dietPlan.estimatedCalories),
      mealsPerDay: numberOrZero(dietPlan.mealsPerDay),
      mainRestriction: dietPlan.mainRestriction ?? null,
      notes: dietPlan.notes ?? null,
    },
    week: {
      days: weekDays,
    },
    summary: {
      weeklyTargetCalories: sumBy(weekDays, (day) => day.targetCalories),
      weeklyConsumedCalories: sumBy(weekDays, (day) => day.consumedCalories),
      daysCount: weekDays.length,
    },
    footer: {
      showGenerationDate: options.showGenerationDate ?? true,
      showProfessionalSignature: options.showProfessionalSignature ?? true,
      customText: options.footerText ?? 'Documento generado por VitalBite',
    },
  };
}

function mapDay(day: DietPlanDayModel): DietPdfDay {
  const meals = [...(day.meals ?? [])]
    .sort((current, next) => current.mealOrder - next.mealOrder)
    .map((meal) => mapMeal(meal));

  return {
    dayId: day.id,
    dayOrder: day.dayOrder,
    dayLabel: day.dayLabel,
    targetCalories: sumBy(meals, (meal) => meal.targetCalories),
    consumedCalories: sumBy(meals, (meal) => meal.consumedCalories),
    meals,
  };
}

function mapMeal(meal: DietMealModel): DietPdfMeal {
  const items = [...(meal.items ?? [])]
    .sort((current, next) => current.itemOrder - next.itemOrder)
    .map((item) => mapItem(item));

  return {
    mealId: meal.id,
    mealOrder: meal.mealOrder,
    mealLabel: meal.name,
    time: meal.notes?.trim() || null,
    targetCalories: numberOrZero(meal.targetCalories),
    consumedCalories: sumBy(items, (item) => item.calories),
    notes: meal.notes ?? null,
    items,
    text: buildMealText(items),
  };
}

function mapItem(item: DietMealItemModel): DietPdfMealItem {
  return {
    itemId: item.id,
    itemOrder: item.itemOrder,
    name: item.name,
    portion: item.portion ?? null,
    calories: numberOrZero(item.calories),
    notes: item.notes ?? null,
  };
}

function buildMealText(items: DietPdfMealItem[]) {
  if (!items.length) {
    return 'Sin alimentos registrados';
  }

  return items
    .map((item) => [item.name, item.portion].filter(Boolean).join(' ').trim())
    .filter(Boolean)
    .join(' + ');
}

function buildFileName(dietPlan: DietPlanModel) {
  return slugify(`dieta-semanal-${dietPlan.patientFullName}-${dietPlan.phase ?? 'sin-fase'}.pdf`);
}

function toIsoDate(value?: Date | null) {
  if (!value) return null;
  return value.toISOString().slice(0, 10);
}

function numberOrZero(value?: number | null) {
  return Number(value) || 0;
}

function sumBy<T>(items: T[], selector: (item: T) => number) {
  return items.reduce((total, item) => total + selector(item), 0);
}

function slugify(value: string) {
  return value
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-zA-Z0-9.-]+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '')
    .toLowerCase();
}
