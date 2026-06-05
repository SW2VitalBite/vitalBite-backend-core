import { Injectable, NotFoundException } from '@nestjs/common';
import { AuthenticatedUser } from '../auth/auth.types';
import {
  PatientStatus,
  Prisma,
  UserStatus,
} from '../../prisma/generated-client';
import { PrismaService } from '../../prisma/prisma.service';
import { CreatePatientInput } from './dto/create-patient.input';
import { PatientFilterInput } from './dto/patient-filter.input';
import { UpdatePatientInput } from './dto/update-patient.input';

@Injectable()
export class PatientsService {
  constructor(private readonly prisma: PrismaService) {}

  async findMany(currentUser: AuthenticatedUser, filter?: PatientFilterInput) {
    return this.prisma.patient.findMany({
      where: this.buildWhere(currentUser.tenantId, filter),
      orderBy: [
        {
          createdAt: 'desc',
        },
        {
          lastName: 'asc',
        },
      ],
    });
  }

  async findById(currentUser: AuthenticatedUser, id: string) {
    const patient = await this.prisma.patient.findFirst({
      where: {
        id,
        tenantId: currentUser.tenantId,
      },
    });

    if (!patient) {
      throw new NotFoundException(
        'Patient was not found in the current tenant.',
      );
    }

    return patient;
  }

  async findByNutritionist(
    currentUser: AuthenticatedUser,
    nutritionistId: string,
  ) {
    await this.ensureNutritionistBelongsToTenant(
      currentUser.tenantId,
      nutritionistId,
    );

    return this.findMany(currentUser, {
      nutritionistId,
    });
  }

  async create(currentUser: AuthenticatedUser, input: CreatePatientInput) {
    const nutritionistId = input.nutritionistId ?? currentUser.id;
    await this.ensureNutritionistBelongsToTenant(
      currentUser.tenantId,
      nutritionistId,
    );

    return this.prisma.patient.create({
      data: {
        tenantId: currentUser.tenantId,
        nutritionistId,
        firstName: input.firstName.trim(),
        lastName: input.lastName.trim(),
        email: input.email?.trim().toLowerCase(),
        phone: input.phone?.trim(),
        birthDate: input.birthDate,
        gender: input.gender,
        status: input.status ?? PatientStatus.ACTIVE,
        clinicalNotes: input.clinicalNotes?.trim(),
        nutritionGoal: input.nutritionGoal?.trim(),
      },
    });
  }

  async update(
    currentUser: AuthenticatedUser,
    id: string,
    input: UpdatePatientInput,
  ) {
    await this.findById(currentUser, id);

    if (input.nutritionistId) {
      await this.ensureNutritionistBelongsToTenant(
        currentUser.tenantId,
        input.nutritionistId,
      );
    }

    const data: Prisma.PatientUpdateInput = {
      firstName: input.firstName?.trim(),
      lastName: input.lastName?.trim(),
      email: input.email?.trim().toLowerCase(),
      phone: input.phone?.trim(),
      birthDate: input.birthDate,
      gender: input.gender,
      status: input.status,
      clinicalNotes: input.clinicalNotes?.trim(),
      nutritionGoal: input.nutritionGoal?.trim(),
    };

    if (input.nutritionistId) {
      data.nutritionist = {
        connect: {
          id: input.nutritionistId,
        },
      };
    }

    if (input.status === PatientStatus.ARCHIVED) {
      data.deletedAt = new Date();
    }

    if (input.status && input.status !== PatientStatus.ARCHIVED) {
      data.deletedAt = null;
    }

    return this.prisma.patient.update({
      where: {
        id,
      },
      data,
    });
  }

  async archive(currentUser: AuthenticatedUser, id: string) {
    await this.findById(currentUser, id);

    return this.prisma.patient.update({
      where: {
        id,
      },
      data: {
        status: PatientStatus.ARCHIVED,
        deletedAt: new Date(),
      },
    });
  }

  async assignToNutritionist(
    currentUser: AuthenticatedUser,
    patientId: string,
    nutritionistId: string,
  ) {
    await this.findById(currentUser, patientId);
    await this.ensureNutritionistBelongsToTenant(
      currentUser.tenantId,
      nutritionistId,
    );

    return this.prisma.patient.update({
      where: {
        id: patientId,
      },
      data: {
        nutritionistId,
      },
    });
  }

  private buildWhere(
    tenantId: string,
    filter?: PatientFilterInput,
  ): Prisma.PatientWhereInput {
    const where: Prisma.PatientWhereInput = {
      tenantId,
    };

    if (filter?.status) {
      where.status = filter.status;

      if (filter.status !== PatientStatus.ARCHIVED) {
        where.deletedAt = null;
      }
    } else {
      where.status = {
        not: PatientStatus.ARCHIVED,
      };
      where.deletedAt = null;
    }

    if (filter?.nutritionistId) {
      where.nutritionistId = filter.nutritionistId;
    }

    if (filter?.search?.trim()) {
      const search = filter.search.trim();
      where.OR = [
        { firstName: { contains: search, mode: 'insensitive' } },
        { lastName: { contains: search, mode: 'insensitive' } },
        { email: { contains: search, mode: 'insensitive' } },
        { phone: { contains: search, mode: 'insensitive' } },
      ];
    }

    if (filter?.createdFrom || filter?.createdTo) {
      where.createdAt = {
        gte: filter.createdFrom,
        lte: filter.createdTo,
      };
    }

    return where;
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
      throw new NotFoundException(
        'Nutritionist was not found in the current tenant.',
      );
    }
  }
}
