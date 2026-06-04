/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import { validate } from 'class-validator';
import {
  Gender,
  PatientStatus,
  TenantStatus,
  UserStatus,
} from '../../prisma/generated-client';
import { CreatePatientInput } from './dto/create-patient.input';
import { PatientsService } from './patients.service';

describe('PatientsService', () => {
  const currentUser = {
    id: '11111111-1111-1111-1111-111111111111',
    tenantId: '22222222-2222-2222-2222-222222222222',
    email: 'elena.cruz@vitalbite.local',
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

  const createPrismaMock = () => ({
    patient: {
      findMany: jest.fn().mockResolvedValue([]),
      findFirst: jest.fn().mockResolvedValue({
        id: '33333333-3333-3333-3333-333333333333',
        tenantId: currentUser.tenantId,
      }),
      create: jest
        .fn()
        .mockImplementation((args) => Promise.resolve(args.data)),
      update: jest
        .fn()
        .mockImplementation((args) =>
          Promise.resolve({ id: args.where.id, ...args.data }),
        ),
    },
    user: {
      findFirst: jest.fn().mockResolvedValue({
        id: currentUser.id,
        tenantId: currentUser.tenantId,
      }),
    },
  });

  it('filters patients by tenant, active records, search and nutritionist', async () => {
    const prisma = createPrismaMock();
    const service = new PatientsService(prisma as any);

    await service.findMany(currentUser, {
      search: 'ana',
      nutritionistId: currentUser.id,
    });

    expect(prisma.patient.findMany).toHaveBeenCalledWith(
      expect.objectContaining({
        where: expect.objectContaining({
          tenantId: currentUser.tenantId,
          nutritionistId: currentUser.id,
          deletedAt: null,
          status: {
            not: PatientStatus.ARCHIVED,
          },
          OR: expect.any(Array),
        }),
      }),
    );
  });

  it('returns archived patients when the archived status is requested', async () => {
    const prisma = createPrismaMock();
    const service = new PatientsService(prisma as any);

    await service.findMany(currentUser, {
      status: PatientStatus.ARCHIVED,
    });

    expect(prisma.patient.findMany).toHaveBeenCalledWith(
      expect.objectContaining({
        where: {
          tenantId: currentUser.tenantId,
          status: PatientStatus.ARCHIVED,
        },
      }),
    );
  });

  it('archives patients with logical deletion', async () => {
    const prisma = createPrismaMock();
    const service = new PatientsService(prisma as any);

    await service.archive(currentUser, '33333333-3333-3333-3333-333333333333');

    expect(prisma.patient.update).toHaveBeenCalledWith({
      where: {
        id: '33333333-3333-3333-3333-333333333333',
      },
      data: {
        status: PatientStatus.ARCHIVED,
        deletedAt: expect.any(Date),
      },
    });
  });

  it('rejects future birth dates at input validation level', async () => {
    const input = new CreatePatientInput();
    input.firstName = 'Maria';
    input.lastName = 'Rodriguez';
    input.email = 'maria.rodriguez@email.com';
    input.phone = '70067890';
    input.birthDate = new Date(Date.now() + 24 * 60 * 60 * 1000);
    input.gender = Gender.FEMALE;
    input.nutritionGoal = 'Reducir grasa corporal';

    const errors = await validate(input);

    expect(errors.some((error) => error.property === 'birthDate')).toBe(true);
  });
});
