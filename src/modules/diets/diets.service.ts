import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { AuthenticatedUser } from '../auth/auth.types';
import {
  DietPlanStatus,
  NotificationType,
  Prisma,
  UserStatus,
} from '../../prisma/generated-client';
import { PrismaService } from '../../prisma/prisma.service';
import { NotificationsService } from '../notifications/notifications.service';
import { CreateDietPlanInput } from './dto/create-diet-plan.input';
import { DietFilterInput } from './dto/diet-filter.input';
import { DietPlanDayInput } from './dto/diet-structure.input';
import { DuplicateDietPlanDayInput } from './dto/duplicate-diet-plan-day.input';
import { UpdateDietPlanStructureInput } from './dto/update-diet-plan-structure.input';
import { UpdateDietPlanInput } from './dto/update-diet-plan.input';

type DietPlanWithStructure = Prisma.DietPlanGetPayload<{
  include: {
    patient: true;
    nutritionist: true;
    days: {
      include: {
        meals: {
          include: {
            items: true;
          };
        };
      };
    };
  };
}>;

@Injectable()
export class DietsService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly notificationsService: NotificationsService,
  ) {}

  async findMany(currentUser: AuthenticatedUser, filter?: DietFilterInput) {
    const diets = await this.prisma.dietPlan.findMany({
      where: this.buildWhere(currentUser.tenantId, filter),
      include: this.includeStructure(),
      orderBy: [
        {
          updatedAt: 'desc',
        },
        {
          name: 'asc',
        },
      ],
    });

    return diets.map((diet) => this.mapDiet(diet));
  }

  async findByPatient(currentUser: AuthenticatedUser, patientId: string) {
    await this.ensurePatientBelongsToTenant(currentUser.tenantId, patientId);
    return this.findMany(currentUser, { patientId });
  }

  async findActiveByPatient(currentUser: AuthenticatedUser, patientId: string) {
    await this.ensurePatientBelongsToTenant(currentUser.tenantId, patientId);

    const diet = await this.prisma.dietPlan.findFirst({
      where: {
        tenantId: currentUser.tenantId,
        patientId,
        status: DietPlanStatus.ACTIVE,
        deletedAt: null,
      },
      include: this.includeStructure(),
      orderBy: {
        updatedAt: 'desc',
      },
    });

    if (!diet) {
      throw new NotFoundException('Active diet was not found for this patient.');
    }

    return this.mapDiet(diet);
  }

  async findById(currentUser: AuthenticatedUser, id: string) {
    const diet = await this.findRecordById(currentUser, id);
    return this.mapDiet(diet);
  }

  async create(currentUser: AuthenticatedUser, input: CreateDietPlanInput) {
    await this.ensurePatientBelongsToTenant(currentUser.tenantId, input.patientId);
    const nutritionistId = input.nutritionistId ?? currentUser.id;
    await this.ensureNutritionistBelongsToTenant(currentUser.tenantId, nutritionistId);

    const diet = await this.prisma.dietPlan.create({
      data: {
        tenantId: currentUser.tenantId,
        patientId: input.patientId,
        nutritionistId,
        name: input.name.trim(),
        objective: input.objective.trim(),
        phase: this.cleanText(input.phase),
        approach: this.cleanText(input.approach),
        startDate: input.startDate,
        endDate: input.endDate,
        status: input.status ?? DietPlanStatus.DRAFT,
        mealsPerDay: input.mealsPerDay,
        mainRestriction: this.cleanText(input.mainRestriction),
        notes: this.cleanText(input.notes),
        estimatedCalories: input.estimatedCalories,
        adherencePercent: input.adherencePercent,
        days: {
          create: this.toDayCreates(input.days ?? this.defaultStructure()),
        },
      },
      include: this.includeStructure(),
    });

    void this.notificationsService.createAndPush({
      tenantId: currentUser.tenantId,
      patientId: input.patientId,
      type: NotificationType.DIETA_ASIGNADA,
      title: 'Nueva dieta asignada',
      body: `Tu nutricionista ha asignado un nuevo plan de alimentación: ${diet.name}.`,
      data: { dietPlanId: diet.id },
    });

    return this.mapDiet(diet);
  }

  async update(currentUser: AuthenticatedUser, id: string, input: UpdateDietPlanInput) {
    await this.findRecordById(currentUser, id);

    const diet = await this.prisma.dietPlan.update({
      where: {
        id,
      },
      data: {
        name: input.name?.trim(),
        objective: input.objective?.trim(),
        phase: this.cleanText(input.phase),
        approach: this.cleanText(input.approach),
        startDate: input.startDate,
        endDate: input.endDate,
        status: input.status,
        mealsPerDay: input.mealsPerDay,
        mainRestriction: this.cleanText(input.mainRestriction),
        notes: this.cleanText(input.notes),
        estimatedCalories: input.estimatedCalories,
        adherencePercent: input.adherencePercent,
        deletedAt: null,
      },
      include: this.includeStructure(),
    });

    return this.mapDiet(diet);
  }

  async updateStructure(
    currentUser: AuthenticatedUser,
    id: string,
    input: UpdateDietPlanStructureInput,
  ) {
    await this.findRecordById(currentUser, id);

    const diet = await this.prisma.$transaction(async (tx) => {
      await tx.dietPlanDay.deleteMany({
        where: {
          dietPlanId: id,
        },
      });

      for (const day of input.days) {
        await tx.dietPlanDay.create({
          data: {
            dietPlanId: id,
            ...this.toDayCreate(day),
          },
        });
      }

      return tx.dietPlan.findFirstOrThrow({
        where: {
          id,
          tenantId: currentUser.tenantId,
        },
        include: this.includeStructure(),
      });
    });

    return this.mapDiet(diet);
  }

  async changeStatus(
    currentUser: AuthenticatedUser,
    id: string,
    status: DietPlanStatus,
  ) {
    await this.findRecordById(currentUser, id);

    const diet = await this.prisma.dietPlan.update({
      where: {
        id,
      },
      data: {
        status,
        deletedAt: null,
      },
      include: this.includeStructure(),
    });

    return this.mapDiet(diet);
  }

  async duplicateDay(currentUser: AuthenticatedUser, input: DuplicateDietPlanDayInput) {
    await this.findRecordById(currentUser, input.dietPlanId);

    const source = await this.prisma.dietPlanDay.findFirst({
      where: {
        id: input.sourceDayId,
        dietPlanId: input.dietPlanId,
      },
      include: {
        meals: {
          orderBy: {
            mealOrder: 'asc',
          },
          include: {
            items: {
              orderBy: {
                itemOrder: 'asc',
              },
            },
          },
        },
      },
    });

    if (!source) {
      throw new NotFoundException('Diet day was not found in this plan.');
    }

    const currentMax = await this.prisma.dietPlanDay.aggregate({
      where: {
        dietPlanId: input.dietPlanId,
      },
      _max: {
        dayOrder: true,
      },
    });
    const dayOrder = input.targetDayOrder ?? (currentMax._max.dayOrder ?? 0) + 1;
    const existing = await this.prisma.dietPlanDay.findFirst({
      where: {
        dietPlanId: input.dietPlanId,
        dayOrder,
      },
    });

    if (existing) {
      throw new BadRequestException('Target day order is already used in this plan.');
    }

    await this.prisma.dietPlanDay.create({
      data: {
        dietPlanId: input.dietPlanId,
        dayLabel: input.targetDayLabel?.trim() || `${source.dayLabel} copia`,
        dayOrder,
        meals: {
          create: source.meals.map((meal) => ({
            name: meal.name,
            mealOrder: meal.mealOrder,
            targetCalories: meal.targetCalories,
            notes: meal.notes,
            items: {
              create: meal.items.map((item) => ({
                name: item.name,
                portion: item.portion,
                calories: item.calories,
                itemOrder: item.itemOrder,
                notes: item.notes,
              })),
            },
          })),
        },
      },
    });

    return this.findById(currentUser, input.dietPlanId);
  }

  private buildWhere(
    tenantId: string,
    filter?: DietFilterInput,
  ): Prisma.DietPlanWhereInput {
    const where: Prisma.DietPlanWhereInput = {
      tenantId,
      deletedAt: null,
    };

    if (filter?.patientId) {
      where.patientId = filter.patientId;
    }

    if (filter?.nutritionistId) {
      where.nutritionistId = filter.nutritionistId;
    }

    if (filter?.status) {
      where.status = filter.status;
    }

    if (filter?.search?.trim()) {
      const search = filter.search.trim();
      where.OR = [
        { name: { contains: search, mode: 'insensitive' } },
        { objective: { contains: search, mode: 'insensitive' } },
        { phase: { contains: search, mode: 'insensitive' } },
        { approach: { contains: search, mode: 'insensitive' } },
        { patient: { firstName: { contains: search, mode: 'insensitive' } } },
        { patient: { lastName: { contains: search, mode: 'insensitive' } } },
      ];
    }

    return where;
  }

  private async findRecordById(currentUser: AuthenticatedUser, id: string) {
    const diet = await this.prisma.dietPlan.findFirst({
      where: {
        id,
        tenantId: currentUser.tenantId,
        deletedAt: null,
      },
      include: this.includeStructure(),
    });

    if (!diet) {
      throw new NotFoundException('Diet plan was not found in the current tenant.');
    }

    return diet;
  }

  private async ensurePatientBelongsToTenant(tenantId: string, patientId: string) {
    const patient = await this.prisma.patient.findFirst({
      where: {
        id: patientId,
        tenantId,
        deletedAt: null,
      },
    });

    if (!patient) {
      throw new NotFoundException('Patient was not found in the current tenant.');
    }
  }

  private async ensureNutritionistBelongsToTenant(
    tenantId: string,
    nutritionistId: string,
  ) {
    const nutritionist = await this.prisma.user.findFirst({
      where: {
        id: nutritionistId,
        tenantId,
        status: UserStatus.ACTIVE,
        deletedAt: null,
      },
    });

    if (!nutritionist) {
      throw new NotFoundException('Nutritionist was not found in the current tenant.');
    }
  }

  private includeStructure() {
    return {
      patient: true,
      nutritionist: true,
      days: {
        orderBy: {
          dayOrder: 'asc',
        },
        include: {
          meals: {
            orderBy: {
              mealOrder: 'asc',
            },
            include: {
              items: {
                orderBy: {
                  itemOrder: 'asc',
                },
              },
            },
          },
        },
      },
    } as const;
  }

  private toDayCreates(days: DietPlanDayInput[]) {
    return days.map((day, index) => this.toDayCreate(day, index));
  }

  private toDayCreate(day: DietPlanDayInput, index = 0) {
    return {
      dayLabel: day.dayLabel.trim(),
      dayOrder: day.dayOrder ?? index + 1,
      meals: {
        create: (day.meals ?? []).map((meal, mealIndex) => ({
          name: meal.name.trim(),
          mealOrder: meal.mealOrder ?? mealIndex + 1,
          targetCalories: meal.targetCalories,
          notes: this.cleanText(meal.notes),
          items: {
            create: (meal.items ?? []).map((item, itemIndex) => ({
              name: item.name.trim(),
              portion: this.cleanText(item.portion),
              calories: item.calories,
              itemOrder: item.itemOrder ?? itemIndex + 1,
              notes: this.cleanText(item.notes),
            })),
          },
        })),
      },
    };
  }

  private defaultStructure(): DietPlanDayInput[] {
    return [
      {
        dayLabel: 'Lunes',
        dayOrder: 1,
        meals: [
          { name: 'Desayuno', mealOrder: 1, targetCalories: 400, items: [] },
          { name: 'Almuerzo', mealOrder: 2, targetCalories: 550, items: [] },
          { name: 'Cena', mealOrder: 3, targetCalories: 380, items: [] },
          { name: 'Colaciones', mealOrder: 4, targetCalories: 200, items: [] },
        ],
      },
    ];
  }

  private cleanText(value?: string | null) {
    const clean = value?.trim();
    return clean ? clean : undefined;
  }

  private mapDiet(diet: DietPlanWithStructure) {
    return {
      ...diet,
      patientFullName: `${diet.patient.firstName} ${diet.patient.lastName}`,
      nutritionistFullName: `${diet.nutritionist.firstName} ${diet.nutritionist.lastName}`,
    };
  }
}
