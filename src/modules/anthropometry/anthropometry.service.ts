import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { AuthenticatedUser } from '../auth/auth.types';
import { AnthropometryMeasurementFilterInput } from './dto/anthropometry-measurement-filter.input';
import { CreateAnthropometryMeasurementInput } from './dto/create-anthropometry-measurement.input';
import { UpdateAnthropometryMeasurementInput } from './dto/update-anthropometry-measurement.input';

@Injectable()
export class AnthropometryService {
  constructor(private readonly prisma: PrismaService) {}

  async findByPatient(
    currentUser: AuthenticatedUser,
    patientId: string,
    filter?: AnthropometryMeasurementFilterInput,
  ) {
    await this.ensurePatientBelongsToTenant(currentUser.tenantId, patientId);
    const anthropometryMeasurement = (this.prisma as any)
      .anthropometryMeasurement;

    return anthropometryMeasurement.findMany({
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
    input: CreateAnthropometryMeasurementInput,
  ) {
    await this.ensurePatientBelongsToTenant(
      currentUser.tenantId,
      input.patientId,
    );
    this.ensureAtLeastOneMeasurement(input);

    if (input.bodyMeasurementId) {
      await this.ensureBodyMeasurementBelongsToPatient(
        currentUser.tenantId,
        input.patientId,
        input.bodyMeasurementId,
      );
    }
    const anthropometryMeasurement = (this.prisma as any)
      .anthropometryMeasurement;

    return anthropometryMeasurement.create({
      data: {
        tenantId: currentUser.tenantId,
        patientId: input.patientId,
        bodyMeasurementId: input.bodyMeasurementId,
        measuredAt: input.measuredAt,
        neckCm: input.neckCm,
        chestThoraxCm: input.chestThoraxCm,
        rightArmCm: input.rightArmCm,
        leftArmCm: input.leftArmCm,
        rightForearmCm: input.rightForearmCm,
        leftForearmCm: input.leftForearmCm,
        waistCm: input.waistCm,
        abdomenCm: input.abdomenCm,
        hipCm: input.hipCm,
        rightThighCm: input.rightThighCm,
        leftThighCm: input.leftThighCm,
        rightCalfCm: input.rightCalfCm,
        leftCalfCm: input.leftCalfCm,
      },
    });
  }

  async update(
    currentUser: AuthenticatedUser,
    id: string,
    input: UpdateAnthropometryMeasurementInput,
  ) {
    const current = await this.findRecordById(currentUser, id);

    if (input.bodyMeasurementId) {
      await this.ensureBodyMeasurementBelongsToPatient(
        currentUser.tenantId,
        current.patientId,
        input.bodyMeasurementId,
      );
    }
    const anthropometryMeasurement = (this.prisma as any)
      .anthropometryMeasurement;

    return anthropometryMeasurement.update({
      where: {
        id,
      },
      data: {
        bodyMeasurementId: input.bodyMeasurementId,
        measuredAt: input.measuredAt,
        neckCm: input.neckCm,
        chestThoraxCm: input.chestThoraxCm,
        rightArmCm: input.rightArmCm,
        leftArmCm: input.leftArmCm,
        rightForearmCm: input.rightForearmCm,
        leftForearmCm: input.leftForearmCm,
        waistCm: input.waistCm,
        abdomenCm: input.abdomenCm,
        hipCm: input.hipCm,
        rightThighCm: input.rightThighCm,
        leftThighCm: input.leftThighCm,
        rightCalfCm: input.rightCalfCm,
        leftCalfCm: input.leftCalfCm,
        deletedAt: null,
      },
    });
  }

  async delete(currentUser: AuthenticatedUser, id: string) {
    await this.findRecordById(currentUser, id);
    const anthropometryMeasurement = (this.prisma as any)
      .anthropometryMeasurement;

    return anthropometryMeasurement.update({
      where: {
        id,
      },
      data: {
        deletedAt: new Date(),
      },
    });
  }

  private buildWhere(
    tenantId: string,
    patientId: string,
    filter?: AnthropometryMeasurementFilterInput,
  ) {
    const where: Record<string, unknown> = {
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

  private ensureAtLeastOneMeasurement(
    input: CreateAnthropometryMeasurementInput,
  ) {
    const values = [
      input.neckCm,
      input.chestThoraxCm,
      input.rightArmCm,
      input.leftArmCm,
      input.rightForearmCm,
      input.leftForearmCm,
      input.waistCm,
      input.abdomenCm,
      input.hipCm,
      input.rightThighCm,
      input.leftThighCm,
      input.rightCalfCm,
      input.leftCalfCm,
    ];

    if (!values.some((value) => value !== null && value !== undefined)) {
      throw new BadRequestException(
        'At least one anthropometry perimeter must be provided.',
      );
    }
  }

  private async findRecordById(currentUser: AuthenticatedUser, id: string) {
    const anthropometryMeasurement = await (this.prisma as any)
      .anthropometryMeasurement.findFirst({
        where: {
          id,
          tenantId: currentUser.tenantId,
        },
      });

    if (!anthropometryMeasurement) {
      throw new NotFoundException(
        'Anthropometry measurement was not found in the current tenant.',
      );
    }

    return anthropometryMeasurement;
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
