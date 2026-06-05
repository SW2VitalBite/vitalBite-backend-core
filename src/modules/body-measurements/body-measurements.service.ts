import { Injectable, NotFoundException } from '@nestjs/common';
import { AuthenticatedUser } from '../auth/auth.types';
import { Prisma } from '../../prisma/generated-client';
import { PrismaService } from '../../prisma/prisma.service';
import { BodyMeasurementFilterInput } from './dto/body-measurement-filter.input';
import { CreateBodyMeasurementInput } from './dto/create-body-measurement.input';
import { UpdateBodyMeasurementInput } from './dto/update-body-measurement.input';

@Injectable()
export class BodyMeasurementsService {
  constructor(private readonly prisma: PrismaService) {}

  async findByPatient(
    currentUser: AuthenticatedUser,
    patientId: string,
    filter?: BodyMeasurementFilterInput,
  ) {
    await this.ensurePatientBelongsToTenant(currentUser.tenantId, patientId);

    return this.prisma.bodyMeasurement.findMany({
      where: this.buildWhere(currentUser.tenantId, patientId, filter),
      orderBy: {
        measuredAt: 'desc',
      },
    });
  }

  async findById(currentUser: AuthenticatedUser, id: string) {
    return this.findRecordById(currentUser, id);
  }

  async create(
    currentUser: AuthenticatedUser,
    input: CreateBodyMeasurementInput,
  ) {
    await this.ensurePatientBelongsToTenant(
      currentUser.tenantId,
      input.patientId,
    );

    return this.prisma.bodyMeasurement.create({
      data: {
        tenantId: currentUser.tenantId,
        patientId: input.patientId,
        registeredById: currentUser.id,
        measuredAt: input.measuredAt,
        weightKg: input.weightKg,
        heightCm: input.heightCm,
        bmi: this.calculateBmi(input.weightKg, input.heightCm),
        waistCm: input.waistCm,
        hipCm: input.hipCm,
      },
    });
  }

  async update(
    currentUser: AuthenticatedUser,
    id: string,
    input: UpdateBodyMeasurementInput,
  ) {
    const current = await this.findRecordById(currentUser, id);
    const weightKg = input.weightKg ?? current.weightKg;
    const heightCm = input.heightCm ?? current.heightCm ?? undefined;

    return this.prisma.bodyMeasurement.update({
      where: {
        id,
      },
      data: {
        measuredAt: input.measuredAt,
        weightKg: input.weightKg,
        heightCm: input.heightCm,
        bmi: this.calculateBmi(weightKg, heightCm),
        waistCm: input.waistCm,
        hipCm: input.hipCm,
        deletedAt: null,
      },
    });
  }

  async delete(currentUser: AuthenticatedUser, id: string) {
    await this.findRecordById(currentUser, id);

    return this.prisma.bodyMeasurement.update({
      where: {
        id,
      },
      data: {
        deletedAt: new Date(),
      },
    });
  }

  calculateBmi(weightKg: number, heightCm?: number | null) {
    if (!heightCm) {
      return null;
    }

    const heightMeters = heightCm / 100;
    return Number((weightKg / (heightMeters * heightMeters)).toFixed(2));
  }

  private buildWhere(
    tenantId: string,
    patientId: string,
    filter?: BodyMeasurementFilterInput,
  ): Prisma.BodyMeasurementWhereInput {
    const where: Prisma.BodyMeasurementWhereInput = {
      tenantId,
      patientId,
      deletedAt: null,
    };

    if (filter?.measuredFrom || filter?.measuredTo) {
      where.measuredAt = {
        gte: filter.measuredFrom,
        lte: filter.measuredTo,
      };
    }

    return where;
  }

  private async findRecordById(currentUser: AuthenticatedUser, id: string) {
    const bodyMeasurement = await this.prisma.bodyMeasurement.findFirst({
      where: {
        id,
        tenantId: currentUser.tenantId,
      },
    });

    if (!bodyMeasurement) {
      throw new NotFoundException(
        'Body measurement was not found in the current tenant.',
      );
    }

    return bodyMeasurement;
  }

  private async ensurePatientBelongsToTenant(
    tenantId: string,
    patientId: string,
  ) {
    const patient = await this.prisma.patient.findFirst({
      where: {
        id: patientId,
        tenantId,
        deletedAt: null,
      },
    });

    if (!patient) {
      throw new NotFoundException(
        'Patient was not found in the current tenant.',
      );
    }
  }
}
