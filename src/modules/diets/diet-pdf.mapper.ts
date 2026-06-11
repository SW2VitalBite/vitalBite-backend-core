import { DietMealItemModel } from './models/diet-meal-item.model';
import { DietMealModel } from './models/diet-meal.model';
import { DietPlanDayModel } from './models/diet-plan-day.model';
import { DietPlanModel } from './models/diet-plan.model';

export interface DietPdfPayload {
  id: string;
  tenantId: string;
  patientId: string;
  nutritionistId: string;
  name: string;
  objective: string;
  phase: string | null;
  approach: string | null;
  startDate: string | null;
  endDate: string | null;
  status: string;
  mealsPerDay: number;
  mainRestriction: string | null;
  notes: string | null;
  estimatedCalories: number;
  adherencePercent: number | null;
  patientFullName: string;
  nutritionistFullName: string;
  days: DietPdfDay[];
}

export interface DietPdfDay {
  id: string;
  dietPlanId: string;
  dayLabel: string;
  dayOrder: number;
  meals: DietPdfMeal[];
}

export interface DietPdfMeal {
  id: string;
  dietPlanDayId: string;
  name: string;
  mealOrder: number;
  targetCalories: number;
  notes: string | null;
  items: DietPdfMealItem[];
}

export interface DietPdfMealItem {
  id: string;
  dietMealId: string;
  name: string;
  portion: string | null;
  calories: number;
  itemOrder: number;
  notes: string | null;
}

export interface MapDietPlanToPdfPayloadOptions {
  requestId?: string;
  generatedAt?: Date;
  delivery?: string;
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
  const weekDays = [...(dietPlan.days ?? [])]
    .sort((current, next) => current.dayOrder - next.dayOrder)
    .map((day) => mapDay(day));

  return {
    id: dietPlan.id,
    tenantId: dietPlan.tenantId,
    patientId: dietPlan.patientId,
    nutritionistId: dietPlan.nutritionistId,
    name: dietPlan.name,
    objective: dietPlan.objective,
    phase: dietPlan.phase ?? null,
    approach: dietPlan.approach ?? null,
    startDate: toIsoDate(dietPlan.startDate),
    endDate: toIsoDate(dietPlan.endDate),
    status: dietPlan.status,
    mealsPerDay: numberOrZero(dietPlan.mealsPerDay),
    mainRestriction: dietPlan.mainRestriction ?? null,
    notes: dietPlan.notes ?? null,
    estimatedCalories: numberOrZero(dietPlan.estimatedCalories),
    adherencePercent: dietPlan.adherencePercent ?? null,
    patientFullName: dietPlan.patientFullName,
    nutritionistFullName: dietPlan.nutritionistFullName,
    days: weekDays,
  };
}

function mapDay(day: DietPlanDayModel): DietPdfDay {
  const meals = [...(day.meals ?? [])]
    .sort((current, next) => current.mealOrder - next.mealOrder)
    .map((meal) => mapMeal(meal));

  return {
    id: day.id,
    dietPlanId: day.dietPlanId,
    dayLabel: day.dayLabel,
    dayOrder: day.dayOrder,
    meals,
  };
}

function mapMeal(meal: DietMealModel): DietPdfMeal {
  const items = [...(meal.items ?? [])]
    .sort((current, next) => current.itemOrder - next.itemOrder)
    .map((item) => mapItem(item));

  return {
    id: meal.id,
    dietPlanDayId: meal.dietPlanDayId,
    name: meal.name,
    mealOrder: meal.mealOrder,
    targetCalories: numberOrZero(meal.targetCalories),
    notes: meal.notes ?? null,
    items,
  };
}

function mapItem(item: DietMealItemModel): DietPdfMealItem {
  return {
    id: item.id,
    dietMealId: item.dietMealId,
    name: item.name,
    portion: item.portion ?? null,
    calories: numberOrZero(item.calories),
    itemOrder: item.itemOrder,
    notes: item.notes ?? null,
  };
}

function buildFileName(dietPlan: DietPlanModel) {
  return slugify(`dieta-semanal-${dietPlan.patientFullName}-${dietPlan.phase ?? 'sin-fase'}.pdf`);
}

function toIsoDate(value?: Date | string | null) {
  if (!value) return null;
  const date = value instanceof Date ? value : new Date(value);
  return date.toISOString().slice(0, 10);
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
