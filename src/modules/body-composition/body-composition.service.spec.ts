/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import { validate } from 'class-validator';
import { TenantStatus, UserStatus } from '../../prisma/generated-client';
import { BodyCompositionService } from './body-composition.service';
import { CreateBodyCompositionInput } from './dto/create-body-composition.input';

describe('BodyCompositionService', () => {
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
    id: '44444444-4444-4444-4444-444444444444',
    tenantId: currentUser.tenantId,
    patientId: patient.id,
    deletedAt: null,
  };

  const bodyComposition = {
    id: '55555555-5555-5555-5555-555555555555',
    tenantId: currentUser.tenantId,
    patientId: patient.id,
    bodyMeasurementId: bodyMeasurement.id,
    measuredAt: new Date('2026-06-01T09:00:00.000Z'),
    bodyFatPercentage: 32,
    muscleMassKg: 44,
    waterPercentage: 49,
    visceralFatLevel: 7,
    boneMassKg: 2.6,
    metabolicAge: 35,
    createdAt: new Date(),
    updatedAt: new Date(),
    deletedAt: null,
  };

  const createPrismaMock = () => ({
    bodyComposition: {
      findMany: jest.fn().mockResolvedValue([]),
      findFirst: jest.fn().mockResolvedValue(bodyComposition),
      create: jest
        .fn()
        .mockImplementation((args) => Promise.resolve(args.data)),
      update: jest
        .fn()
        .mockImplementation((args) =>
          Promise.resolve({ ...bodyComposition, ...args.data }),
        ),
    },
    bodyMeasurement: {
      findFirst: jest.fn().mockResolvedValue(bodyMeasurement),
    },
    patient: {
      findFirst: jest.fn().mockResolvedValue(patient),
    },
  });

  it('creates composition linked to a valid body measurement', async () => {
    const prisma = createPrismaMock();
    const service = new BodyCompositionService(prisma as any);

    await service.create(currentUser, {
      patientId: patient.id,
      bodyMeasurementId: bodyMeasurement.id,
      measuredAt: new Date('2026-06-01T09:00:00.000Z'),
      bodyFatPercentage: 32,
      muscleMassKg: 44,
      waterPercentage: 49,
    });

    expect(prisma.bodyMeasurement.findFirst).toHaveBeenCalledWith({
      where: {
        id: bodyMeasurement.id,
        tenantId: currentUser.tenantId,
        patientId: patient.id,
        deletedAt: null,
      },
    });
    expect(prisma.bodyComposition.create).toHaveBeenCalledWith(
      expect.objectContaining({
        data: expect.objectContaining({
          tenantId: currentUser.tenantId,
          patientId: patient.id,
          bodyMeasurementId: bodyMeasurement.id,
        }),
      }),
    );
  });

  it('returns latest composition ordered by measured date', async () => {
    const prisma = createPrismaMock();
    const service = new BodyCompositionService(prisma as any);

    await service.findLatestByPatient(currentUser, patient.id);

    expect(prisma.bodyComposition.findFirst).toHaveBeenCalledWith(
      expect.objectContaining({
        where: {
          tenantId: currentUser.tenantId,
          patientId: patient.id,
          deletedAt: null,
        },
        orderBy: {
          measuredAt: 'desc',
        },
      }),
    );
  });

  it('logically deletes composition records', async () => {
    const prisma = createPrismaMock();
    const service = new BodyCompositionService(prisma as any);

    await service.delete(currentUser, bodyComposition.id);

    expect(prisma.bodyComposition.update).toHaveBeenCalledWith({
      where: {
        id: bodyComposition.id,
      },
      data: {
        deletedAt: expect.any(Date),
      },
    });
  });

  it('rejects percentages over 100 at input validation level', async () => {
    const input = new CreateBodyCompositionInput();
    input.patientId = patient.id;
    input.measuredAt = new Date('2026-06-01T09:00:00.000Z');
    input.bodyFatPercentage = 120;

    const errors = await validate(input);

    expect(errors.some((error) => error.property === 'bodyFatPercentage')).toBe(
      true,
    );
  });
});
