/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import { validate } from 'class-validator';
import { TenantStatus, UserStatus } from '../../prisma/generated-client';
import { CreateBodyMeasurementInput } from './dto/create-body-measurement.input';
import { BodyMeasurementsService } from './body-measurements.service';

describe('BodyMeasurementsService', () => {
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

  const measurement = {
    id: '44444444-4444-4444-4444-444444444444',
    tenantId: currentUser.tenantId,
    patientId: patient.id,
    registeredById: currentUser.id,
    measuredAt: new Date('2026-06-01T09:00:00.000Z'),
    weightKg: 70,
    heightCm: 170,
    bmi: 24.22,
    waistCm: 82,
    hipCm: 98,
    createdAt: new Date(),
    updatedAt: new Date(),
    deletedAt: null,
  };

  const createPrismaMock = () => ({
    bodyMeasurement: {
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
  });

  it('filters measurements by tenant, patient and measured range', async () => {
    const prisma = createPrismaMock();
    const service = new BodyMeasurementsService(prisma as any);
    const measuredFrom = new Date('2026-06-01T00:00:00.000Z');
    const measuredTo = new Date('2026-06-30T23:59:59.000Z');

    await service.findByPatient(currentUser, patient.id, {
      measuredFrom,
      measuredTo,
    });

    expect(prisma.bodyMeasurement.findMany).toHaveBeenCalledWith(
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

  it('calculates bmi when weight and height are provided', async () => {
    const prisma = createPrismaMock();
    const service = new BodyMeasurementsService(prisma as any);

    await service.create(currentUser, {
      patientId: patient.id,
      measuredAt: new Date('2026-06-01T09:00:00.000Z'),
      weightKg: 70,
      heightCm: 170,
    });

    expect(prisma.bodyMeasurement.create).toHaveBeenCalledWith(
      expect.objectContaining({
        data: expect.objectContaining({
          bmi: 24.22,
          registeredById: currentUser.id,
          tenantId: currentUser.tenantId,
        }),
      }),
    );
  });

  it('recalculates bmi when weight or height changes', async () => {
    const prisma = createPrismaMock();
    const service = new BodyMeasurementsService(prisma as any);

    await service.update(currentUser, measurement.id, {
      weightKg: 68,
    });

    expect(prisma.bodyMeasurement.update).toHaveBeenCalledWith(
      expect.objectContaining({
        data: expect.objectContaining({
          bmi: 23.53,
        }),
      }),
    );
  });

  it('logically deletes measurements', async () => {
    const prisma = createPrismaMock();
    const service = new BodyMeasurementsService(prisma as any);

    await service.delete(currentUser, measurement.id);

    expect(prisma.bodyMeasurement.update).toHaveBeenCalledWith({
      where: {
        id: measurement.id,
      },
      data: {
        deletedAt: expect.any(Date),
      },
    });
  });

  it('rejects future measured dates at input validation level', async () => {
    const input = new CreateBodyMeasurementInput();
    input.patientId = patient.id;
    input.measuredAt = new Date(Date.now() + 24 * 60 * 60 * 1000);
    input.weightKg = 70;

    const errors = await validate(input);

    expect(errors.some((error) => error.property === 'measuredAt')).toBe(true);
  });

  it('rejects non-positive weight at input validation level', async () => {
    const input = new CreateBodyMeasurementInput();
    input.patientId = patient.id;
    input.measuredAt = new Date('2026-06-01T09:00:00.000Z');
    input.weightKg = 0;

    const errors = await validate(input);

    expect(errors.some((error) => error.property === 'weightKg')).toBe(true);
  });
});
