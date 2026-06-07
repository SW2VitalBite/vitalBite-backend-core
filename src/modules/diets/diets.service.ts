import { Injectable, NotFoundException } from '@nestjs/common';
import { NotificationType } from '../../prisma/generated-client';
import { AuthenticatedUser } from '../auth/auth.types';
import { PrismaService } from '../../prisma/prisma.service';
import { NotificationsService } from '../notifications/notifications.service';
import { CreateDietInput } from './dto/create-diet.input';

const includeMealsAndItems = {
  meals: {
    include: {
      items: true,
    },
  },
} as const;

@Injectable()
export class DietsService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly notificationsService: NotificationsService,
  ) {}

  async activeDietByPatient(currentUser: AuthenticatedUser, patientId: string) {
    return this.prisma.diet.findFirst({
      where: {
        tenantId: currentUser.tenantId,
        patientId,
        isActive: true,
        deletedAt: null,
      },
      include: includeMealsAndItems,
      orderBy: { createdAt: 'desc' },
    });
  }

  async dietsByPatient(currentUser: AuthenticatedUser, patientId: string) {
    return this.prisma.diet.findMany({
      where: {
        tenantId: currentUser.tenantId,
        patientId,
        deletedAt: null,
      },
      include: includeMealsAndItems,
      orderBy: { createdAt: 'desc' },
    });
  }

  async dietById(currentUser: AuthenticatedUser, id: string) {
    const diet = await this.prisma.diet.findFirst({
      where: {
        id,
        tenantId: currentUser.tenantId,
        deletedAt: null,
      },
      include: includeMealsAndItems,
    });

    if (!diet) {
      throw new NotFoundException('Dieta no encontrada.');
    }

    return diet;
  }

  async create(currentUser: AuthenticatedUser, input: CreateDietInput) {
    await this.prisma.$transaction(async (tx) => {
      // Desactivar dietas anteriores del paciente
      await tx.diet.updateMany({
        where: {
          tenantId: currentUser.tenantId,
          patientId: input.patientId,
          isActive: true,
          deletedAt: null,
        },
        data: { isActive: false },
      });
    });

    const diet = await this.prisma.diet.create({
      data: {
        tenantId: currentUser.tenantId,
        patientId: input.patientId,
        nutritionistId: currentUser.id,
        appointmentId: input.appointmentId,
        name: input.name.trim(),
        objective: input.objective?.trim(),
        startDate: input.startDate,
        endDate: input.endDate,
        isActive: true,
        meals: {
          create: input.meals.map((meal) => ({
            mealType: meal.mealType,
            name: meal.name?.trim(),
            items: {
              create: meal.items.map((item) => ({
                name: item.name.trim(),
                quantity: item.quantity,
                unit: item.unit.trim(),
                calories: item.calories,
                protein: item.protein,
                carbs: item.carbs,
                fat: item.fat,
              })),
            },
          })),
        },
      },
      include: includeMealsAndItems,
    });

    void this.notificationsService.createAndPush({
      tenantId: currentUser.tenantId,
      patientId: input.patientId,
      type: NotificationType.DIETA_ASIGNADA,
      title: 'Nueva dieta asignada',
      body: `Tu nutricionista ha asignado un nuevo plan de alimentación: ${input.name}.`,
      data: { dietId: diet.id },
    });

    return diet;
  }

  async deactivate(currentUser: AuthenticatedUser, id: string) {
    await this.dietById(currentUser, id);

    return this.prisma.diet.update({
      where: { id },
      data: { isActive: false },
      include: includeMealsAndItems,
    });
  }
}
