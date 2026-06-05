/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import { BadRequestException, NotFoundException } from '@nestjs/common';
import { validate } from 'class-validator';
import { TenantStatus, UserStatus } from '../../prisma/generated-client';
import { CreateAnthropometryMeasurementInput } from './dto/create-anthropometry-measurement.input';
import { AnthropometryService } from './anthropometry.service';

describe('AnthropometryService', () => {
  const currentUser = {
    id: '11111111-1111-1111-1111-111111111111',
    tenantId: '22222222-2222-2222-2222-222222222222',
    email: 'elena.cruz@gmail.com',
    firstName: 'Elena',
    lastName: 'Cruz',
    status: UserStatus.ACTIVE,
    roleCode: 'NUTRICIONISTA',
    createdAt: new Date(),
    updatedAt: new Date(),
    deletedAt: null,
    tenant: {
      id: '22222222-2222-2222-2222-222222222222',
      name: 'Clinica Central',
      slug: 'clinica-central',
      status: TenantStatus.ACTIVE,
      createdAt: new Date(),
      updatedAt: new Date(),
      deletedAt: null,
    },
  };

  const patient = {
    id: '33333333-3333-3333-3333-333333333333',
    tenantId: currentUser.tenantId,
  };

  const bodyMeasurement = {
    id: '55555555-5555-5555-5555-555555555555',
    tenantId: currentUser.tenantId,
    patientId: patient.id,
    deletedAt: null,
  };

  const measurement = {
    id: '44444444-4444-4444-4444-444444444444',
    tenantId: currentUser.tenantId,
    patientId: patient.id,
    bodyMeasurementId: bodyMeasurement.id,
    measuredAt: new Date('2026-06-01T09:00:00.000Z'),
    neckCm: 38,
    chestThoraxCm: 98,
    rightArmCm: 32.5,
    leftArmCm: 31.8,
    rightForearmCm: 27,
    leftForearmCm: 26.5,
    waistCm: 82,
    abdomenCm: 88,
    hipCm: 98,
    rightThighCm: 56,
    leftThighCm: 55.5,
    rightCalfCm: 36,
    leftCalfCm: 35.5,
    createdAt: new Date(),
    updatedAt: new Date(),
    deletedAt: null,
  };

  const createPrismaMock = () => ({
    anthropometryMeasurement: {
      findMany: jest.fn().mockResolvedValue([]),
      findFirst: jest.fn().mockResolvedValue(measurement),
      create: jest
        .fn()
        .mockImplementation((args) => Promise.resolve(args.data)),
      update: jest
        .fn()
        .mockImplementation((args) =>
          Promise.resolve({ ...measurement, ...args.data }),
        ),
    },
    patient: {
      findFirst: jest.fn().mockResolvedValue(patient),
    },
    bodyMeasurement: {
      findFirst: jest.fn().mockResolvedValue(bodyMeasurement),
    },
  });

  it('filters anthropometry measurements by tenant, patient and measured range', async () => {
    const prisma = createPrismaMock();
    const service = new AnthropometryService(prisma as any);
    const measuredFrom = new Date('2026-06-01T00:00:00.000Z');
    const measuredTo = new Date('2026-06-30T23:59:59.000Z');

    await service.findByPatient(currentUser, patient.id, {
      measuredFrom,
      measuredTo,
    });

    expect(prisma.anthropometryMeasurement.findMany).toHaveBeenCalledWith(
      expect.objectContaining({
        where: {
          tenantId: currentUser.tenantId,
          patientId: patient.id,
          deletedAt: null,
          measuredAt: {
            gte: measuredFrom,
            lte: measuredTo,
          },
        },
      }),
    );
  });

  it('creates a valid anthropometry measurement', async () => {
    const prisma = createPrismaMock();
    const service = new AnthropometryService(prisma as any);

    await service.create(currentUser, {
      patientId: patient.id,
      bodyMeasurementId: bodyMeasurement.id,
      measuredAt: new Date('2026-06-01T09:00:00.000Z'),
      waistCm: 82,
      hipCm: 98,
    });

    expect(prisma.anthropometryMeasurement.create).toHaveBeenCalledWith(
      expect.objectContaining({
        data: expect.objectContaining({
          tenantId: currentUser.tenantId,
          patientId: patient.id,
          bodyMeasurementId: bodyMeasurement.id,
          waistCm: 82,
          hipCm: 98,
        }),
      }),
    );
  });

  it('rejects creation without any perimeter', async () => {
    const prisma = createPrismaMock();
    const service = new AnthropometryService(prisma as any);

    await expect(
      service.create(currentUser, {
        patientId: patient.id,
        measuredAt: new Date('2026-06-01T09:00:00.000Z'),
      }),
    ).rejects.toBeInstanceOf(BadRequestException);
  });

  it('rejects a bodyMeasurementId from another patient or tenant', async () => {
    const prisma = createPrismaMock();
    prisma.bodyMeasurement.findFirst.mockResolvedValueOnce(null);
    const service = new AnthropometryService(prisma as any);

    await expect(
      service.create(currentUser, {
        patientId: patient.id,
        bodyMeasurementId: bodyMeasurement.id,
        measuredAt: new Date('2026-06-01T09:00:00.000Z'),
        waistCm: 82,
      }),
    ).rejects.toBeInstanceOf(NotFoundException);
  });

  it('logically deletes anthropometry measurements', async () => {
    const prisma = createPrismaMock();
    const service = new AnthropometryService(prisma as any);

    await service.delete(currentUser, measurement.id);

    expect(prisma.anthropometryMeasurement.update).toHaveBeenCalledWith({
      where: {
        id: measurement.id,
      },
      data: {
        deletedAt: expect.any(Date),
      },
    });
  });

  it('rejects future measured dates at input validation level', async () => {
    const input = new CreateAnthropometryMeasurementInput();
    input.patientId = patient.id;
    input.measuredAt = new Date(Date.now() + 24 * 60 * 60 * 1000);
    input.waistCm = 82;

    const errors = await validate(input);

    expect(errors.some((error) => error.property === 'measuredAt')).toBe(true);
  });

  it('rejects non-positive perimeter values at input validation level', async () => {
    const input = new CreateAnthropometryMeasurementInput();
    input.patientId = patient.id;
    input.measuredAt = new Date('2026-06-01T09:00:00.000Z');
    input.neckCm = 0;

    const errors = await validate(input);

    expect(errors.some((error) => error.property === 'neckCm')).toBe(true);
  });
});
