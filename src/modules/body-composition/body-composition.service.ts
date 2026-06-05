import { Injectable, NotFoundException } from '@nestjs/common';
import { AuthenticatedUser } from '../auth/auth.types';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateBodyCompositionInput } from './dto/create-body-composition.input';
import { UpdateBodyCompositionInput } from './dto/update-body-composition.input';

@Injectable()
export class BodyCompositionService {
  constructor(private readonly prisma: PrismaService) {}

  async findByPatient(currentUser: AuthenticatedUser, patientId: string) {
    await this.ensurePatientBelongsToTenant(currentUser.tenantId, patientId);

    return this.prisma.bodyComposition.findMany({
      where: {
        tenantId: currentUser.tenantId,
        patientId,
        deletedAt: null,
      },
      orderBy: {
        measuredAt: 'desc',
      },
    });
  }

  async findLatestByPatient(currentUser: AuthenticatedUser, patientId: string) {
    await this.ensurePatientBelongsToTenant(currentUser.tenantId, patientId);

    const bodyComposition = await this.prisma.bodyComposition.findFirst({
      where: {
        tenantId: currentUser.tenantId,
        patientId,
        deletedAt: null,
      },
      orderBy: {
        measuredAt: 'desc',
      },
    });

    if (!bodyComposition) {
      throw new NotFoundException(
        'Body composition was not found for the current patient.',
      );
    }

    return bodyComposition;
  }

  async create(
    currentUser: AuthenticatedUser,
    input: CreateBodyCompositionInput,
  ) {
    await this.ensurePatientBelongsToTenant(
      currentUser.tenantId,
      input.patientId,
    );

    if (input.bodyMeasurementId) {
      await this.ensureBodyMeasurementBelongsToPatient(
        currentUser.tenantId,
        input.patientId,
        input.bodyMeasurementId,
      );
    }

    return this.prisma.bodyComposition.create({
      data: {
        tenantId: currentUser.tenantId,
        patientId: input.patientId,
        bodyMeasurementId: input.bodyMeasurementId,
        measuredAt: input.measuredAt,
        bodyFatPercentage: input.bodyFatPercentage,
        muscleMassKg: input.muscleMassKg,
        waterPercentage: input.waterPercentage,
        visceralFatLevel: input.visceralFatLevel,
        boneMassKg: input.boneMassKg,
        metabolicAge: input.metabolicAge,
      },
    });
  }

  async update(
    currentUser: AuthenticatedUser,
    id: string,
    input: UpdateBodyCompositionInput,
  ) {
    const current = await this.findRecordById(currentUser, id);

    if (input.bodyMeasurementId) {
      await this.ensureBodyMeasurementBelongsToPatient(
        currentUser.tenantId,
        current.patientId,
        input.bodyMeasurementId,
      );
    }

    return this.prisma.bodyComposition.update({
      where: {
        id,
      },
      data: {
        bodyMeasurementId: input.bodyMeasurementId,
        measuredAt: input.measuredAt,
        bodyFatPercentage: input.bodyFatPercentage,
        muscleMassKg: input.muscleMassKg,
        waterPercentage: input.waterPercentage,
        visceralFatLevel: input.visceralFatLevel,
        boneMassKg: input.boneMassKg,
        metabolicAge: input.metabolicAge,
        deletedAt: null,
      },
    });
  }

  async delete(currentUser: AuthenticatedUser, id: string) {
    await this.findRecordById(currentUser, id);

    return this.prisma.bodyComposition.update({
      where: {
        id,
      },
      data: {
        deletedAt: new Date(),
      },
    });
  }

  private async findRecordById(currentUser: AuthenticatedUser, id: string) {
    const bodyComposition = await this.prisma.bodyComposition.findFirst({
      where: {
        id,
        tenantId: currentUser.tenantId,
      },
    });

    if (!bodyComposition) {
      throw new NotFoundException(
        'Body composition was not found in the current tenant.',
      );
    }

    return bodyComposition;
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

  private async ensureBodyMeasurementBelongsToPatient(
    tenantId: string,
    patientId: string,
    bodyMeasurementId: string,
  ) {
    const bodyMeasurement = await this.prisma.bodyMeasurement.findFirst({
      where: {
        id: bodyMeasurementId,
        tenantId,
        patientId,
        deletedAt: null,
      },
    });

    if (!bodyMeasurement) {
      throw new NotFoundException(
        'Body measurement was not found for the current patient.',
      );
    }
  }
}
