/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import { BadRequestException, ConflictException } from '@nestjs/common';
import { validate } from 'class-validator';
import {
  AppointmentMode,
  AppointmentStatus,
  TenantStatus,
  UserStatus,
} from '../../prisma/generated-client';
import { CreateAppointmentInput } from './dto/create-appointment.input';
import { AppointmentsService } from './appointments.service';

describe('AppointmentsService', () => {
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
    firstName: 'Ana',
    lastName: 'Rojas',
  };

  const nutritionist = {
    id: currentUser.id,
    tenantId: currentUser.tenantId,
    firstName: 'Elena',
    lastName: 'Cruz',
  };

  const appointment = {
    id: '44444444-4444-4444-4444-444444444444',
    tenantId: currentUser.tenantId,
    patientId: patient.id,
    nutritionistId: nutritionist.id,
    scheduledAt: new Date('2026-06-08T09:00:00.000Z'),
    durationMinutes: 45,
    status: AppointmentStatus.SCHEDULED,
    mode: AppointmentMode.IN_PERSON,
    reason: 'Control',
    notes: null,
    cancelReason: null,
    createdAt: new Date(),
    updatedAt: new Date(),
    deletedAt: null,
    patient,
    nutritionist,
  };

  const createPrismaMock = () => ({
    appointment: {
      findMany: jest.fn().mockResolvedValue([]),
      findFirst: jest.fn().mockResolvedValue(appointment),
      create: jest
        .fn()
        .mockImplementation((args) =>
          Promise.resolve({ ...appointment, ...args.data }),
        ),
      update: jest
        .fn()
        .mockImplementation((args) =>
          Promise.resolve({ ...appointment, ...args.data }),
        ),
    },
    patient: {
      findFirst: jest.fn().mockResolvedValue(patient),
    },
    user: {
      findFirst: jest.fn().mockResolvedValue(nutritionist),
    },
  });

  it('filters appointments by tenant, status, people, date range and search', async () => {
    const prisma = createPrismaMock();
    const service = new AppointmentsService(prisma as any);
    const dateFrom = new Date('2026-06-08T00:00:00.000Z');
    const dateTo = new Date('2026-06-12T23:59:59.000Z');

    await service.findMany(currentUser, {
      patientId: patient.id,
      nutritionistId: nutritionist.id,
      status: AppointmentStatus.CONFIRMED,
      dateFrom,
      dateTo,
      search: 'ana',
    });

    expect(prisma.appointment.findMany).toHaveBeenCalledWith(
      expect.objectContaining({
        where: expect.objectContaining({
          tenantId: currentUser.tenantId,
          patientId: patient.id,
          nutritionistId: nutritionist.id,
          status: AppointmentStatus.CONFIRMED,
          deletedAt: null,
          scheduledAt: {
            gte: dateFrom,
            lte: dateTo,
          },
          OR: expect.any(Array),
        }),
      }),
    );
  });

  it('creates an appointment with valid patient and nutritionist', async () => {
    const prisma = createPrismaMock();
    const service = new AppointmentsService(prisma as any);

    const created = await service.create(currentUser, {
      patientId: patient.id,
      nutritionistId: nutritionist.id,
      scheduledAt: new Date('2026-06-08T11:00:00.000Z'),
      durationMinutes: 45,
      mode: AppointmentMode.VIRTUAL,
      reason: 'Seguimiento',
    });

    expect(prisma.patient.findFirst).toHaveBeenCalledWith(
      expect.objectContaining({
        where: expect.objectContaining({
          id: patient.id,
          tenantId: currentUser.tenantId,
        }),
      }),
    );
    expect(prisma.appointment.create).toHaveBeenCalledWith(
      expect.objectContaining({
        data: expect.objectContaining({
          tenantId: currentUser.tenantId,
          patientId: patient.id,
          nutritionistId: nutritionist.id,
          status: AppointmentStatus.SCHEDULED,
          mode: AppointmentMode.VIRTUAL,
        }),
      }),
    );
    expect(created.patientFullName).toBe('Ana Rojas');
  });

  it('rejects duration lower than or equal to zero', async () => {
    const prisma = createPrismaMock();
    const service = new AppointmentsService(prisma as any);

    await expect(
      service.create(currentUser, {
        patientId: patient.id,
        nutritionistId: nutritionist.id,
        scheduledAt: new Date('2026-06-08T11:00:00.000Z'),
        durationMinutes: 0,
      }),
    ).rejects.toBeInstanceOf(BadRequestException);
  });

  it('rejects overlapping active appointments for the same nutritionist', async () => {
    const prisma = createPrismaMock();
    prisma.appointment.findMany.mockResolvedValueOnce([
      {
        ...appointment,
        scheduledAt: new Date('2026-06-08T10:00:00.000Z'),
        durationMinutes: 60,
      },
    ]);
    const service = new AppointmentsService(prisma as any);

    await expect(
      service.create(currentUser, {
        patientId: patient.id,
        nutritionistId: nutritionist.id,
        scheduledAt: new Date('2026-06-08T10:30:00.000Z'),
        durationMinutes: 45,
      }),
    ).rejects.toBeInstanceOf(ConflictException);
  });

  it('updates status when confirming, rescheduling, cancelling, completing and marking no-show', async () => {
    const prisma = createPrismaMock();
    const service = new AppointmentsService(prisma as any);

    await service.confirm(currentUser, appointment.id);
    await service.reschedule(currentUser, appointment.id, {
      scheduledAt: new Date('2026-06-08T12:00:00.000Z'),
      durationMinutes: 45,
    });
    await service.cancel(currentUser, appointment.id, {
      reason: 'Paciente solicito cambio.',
    });
    await service.complete(currentUser, appointment.id, {
      notes: 'Atencion completada.',
    });
    await service.markNoShow(currentUser, appointment.id);

    expect(prisma.appointment.update).toHaveBeenNthCalledWith(
      1,
      expect.objectContaining({
        data: expect.objectContaining({
          status: AppointmentStatus.CONFIRMED,
        }),
      }),
    );
    expect(prisma.appointment.update).toHaveBeenNthCalledWith(
      2,
      expect.objectContaining({
        data: expect.objectContaining({
          status: AppointmentStatus.RESCHEDULED,
        }),
      }),
    );
    expect(prisma.appointment.update).toHaveBeenNthCalledWith(
      3,
      expect.objectContaining({
        data: expect.objectContaining({
          status: AppointmentStatus.CANCELLED,
          deletedAt: expect.any(Date),
        }),
      }),
    );
    expect(prisma.appointment.update).toHaveBeenNthCalledWith(
      4,
      expect.objectContaining({
        data: expect.objectContaining({
          status: AppointmentStatus.COMPLETED,
        }),
      }),
    );
    expect(prisma.appointment.update).toHaveBeenNthCalledWith(
      5,
      expect.objectContaining({
        data: expect.objectContaining({
          status: AppointmentStatus.NO_SHOW,
        }),
      }),
    );
  });

  it('rejects invalid duration at input validation level', async () => {
    const input = new CreateAppointmentInput();
    input.patientId = patient.id;
    input.nutritionistId = nutritionist.id;
    input.scheduledAt = new Date('2026-06-08T11:00:00.000Z');
    input.durationMinutes = 0;

    const errors = await validate(input);

    expect(errors.some((error) => error.property === 'durationMinutes')).toBe(
      true,
    );
  });
});
