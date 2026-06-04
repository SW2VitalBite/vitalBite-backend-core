import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { DemoCurrentUser } from '../demo-context/demo-context.service';
import {
  AppointmentMode,
  AppointmentStatus,
  Prisma,
  UserStatus,
} from '../../prisma/generated-client';
import { PrismaService } from '../../prisma/prisma.service';
import { AppointmentFilterInput } from './dto/appointment-filter.input';
import { CancelAppointmentInput } from './dto/cancel-appointment.input';
import { CompleteAppointmentInput } from './dto/complete-appointment.input';
import { CreateAppointmentInput } from './dto/create-appointment.input';
import { RescheduleAppointmentInput } from './dto/reschedule-appointment.input';

const activeConflictStatuses: AppointmentStatus[] = [
  AppointmentStatus.SCHEDULED,
  AppointmentStatus.CONFIRMED,
  AppointmentStatus.RESCHEDULED,
];

type AppointmentWithPeople = Prisma.AppointmentGetPayload<{
  include: {
    patient: true;
    nutritionist: true;
  };
}>;

@Injectable()
export class AppointmentsService {
  constructor(private readonly prisma: PrismaService) {}

  async findMany(
    currentUser: DemoCurrentUser,
    filter?: AppointmentFilterInput,
  ) {
    const appointments = await this.prisma.appointment.findMany({
      where: this.buildWhere(currentUser.tenantId, filter),
      include: this.includePeople(),
      orderBy: {
        scheduledAt: 'asc',
      },
    });

    return appointments.map((appointment) => this.mapAppointment(appointment));
  }

  async findById(currentUser: DemoCurrentUser, id: string) {
    const appointment = await this.findRecordById(currentUser, id);
    return this.mapAppointment(appointment);
  }

  async findByPatient(currentUser: DemoCurrentUser, patientId: string) {
    await this.ensurePatientBelongsToTenant(currentUser.tenantId, patientId);

    return this.findMany(currentUser, {
      patientId,
    });
  }

  async findCalendar(
    currentUser: DemoCurrentUser,
    filter?: AppointmentFilterInput,
  ) {
    return this.findMany(currentUser, filter);
  }

  async create(currentUser: DemoCurrentUser, input: CreateAppointmentInput) {
    this.ensureValidSchedule(input.scheduledAt, input.durationMinutes);
    await this.ensurePatientBelongsToTenant(
      currentUser.tenantId,
      input.patientId,
    );
    await this.ensureNutritionistBelongsToTenant(
      currentUser.tenantId,
      input.nutritionistId,
    );

    const status = input.status ?? AppointmentStatus.SCHEDULED;

    if (activeConflictStatuses.includes(status)) {
      await this.ensureNutritionistHasNoConflict({
        tenantId: currentUser.tenantId,
        nutritionistId: input.nutritionistId,
        scheduledAt: input.scheduledAt,
        durationMinutes: input.durationMinutes,
      });
    }

    const appointment = await this.prisma.appointment.create({
      data: {
        tenantId: currentUser.tenantId,
        patientId: input.patientId,
        nutritionistId: input.nutritionistId,
        scheduledAt: input.scheduledAt,
        durationMinutes: input.durationMinutes,
        status,
        mode: input.mode ?? AppointmentMode.IN_PERSON,
        reason: input.reason?.trim(),
        notes: input.notes?.trim(),
      },
      include: this.includePeople(),
    });

    return this.mapAppointment(appointment);
  }

  async confirm(currentUser: DemoCurrentUser, id: string) {
    await this.findRecordById(currentUser, id);

    const appointment = await this.prisma.appointment.update({
      where: { id },
      data: {
        status: AppointmentStatus.CONFIRMED,
        deletedAt: null,
      },
      include: this.includePeople(),
    });

    return this.mapAppointment(appointment);
  }

  async reschedule(
    currentUser: DemoCurrentUser,
    id: string,
    input: RescheduleAppointmentInput,
  ) {
    this.ensureValidSchedule(input.scheduledAt, input.durationMinutes);
    const current = await this.findRecordById(currentUser, id);

    await this.ensureNutritionistHasNoConflict({
      tenantId: currentUser.tenantId,
      nutritionistId: current.nutritionistId,
      scheduledAt: input.scheduledAt,
      durationMinutes: input.durationMinutes,
      excludeAppointmentId: id,
    });

    const appointment = await this.prisma.appointment.update({
      where: { id },
      data: {
        scheduledAt: input.scheduledAt,
        durationMinutes: input.durationMinutes,
        reason: input.reason?.trim(),
        notes: input.notes?.trim(),
        status: AppointmentStatus.RESCHEDULED,
        deletedAt: null,
      },
      include: this.includePeople(),
    });

    return this.mapAppointment(appointment);
  }

  async cancel(
    currentUser: DemoCurrentUser,
    id: string,
    input: CancelAppointmentInput,
  ) {
    await this.findRecordById(currentUser, id);

    const appointment = await this.prisma.appointment.update({
      where: { id },
      data: {
        status: AppointmentStatus.CANCELLED,
        cancelReason: input.reason.trim(),
        deletedAt: new Date(),
      },
      include: this.includePeople(),
    });

    return this.mapAppointment(appointment);
  }

  async complete(
    currentUser: DemoCurrentUser,
    id: string,
    input?: CompleteAppointmentInput,
  ) {
    await this.findRecordById(currentUser, id);

    const appointment = await this.prisma.appointment.update({
      where: { id },
      data: {
        status: AppointmentStatus.COMPLETED,
        notes: input?.notes?.trim(),
        deletedAt: null,
      },
      include: this.includePeople(),
    });

    return this.mapAppointment(appointment);
  }

  async markNoShow(currentUser: DemoCurrentUser, id: string) {
    await this.findRecordById(currentUser, id);

    const appointment = await this.prisma.appointment.update({
      where: { id },
      data: {
        status: AppointmentStatus.NO_SHOW,
        deletedAt: null,
      },
      include: this.includePeople(),
    });

    return this.mapAppointment(appointment);
  }

  private buildWhere(
    tenantId: string,
    filter?: AppointmentFilterInput,
  ): Prisma.AppointmentWhereInput {
    const where: Prisma.AppointmentWhereInput = {
      tenantId,
    };

    if (filter?.status) {
      where.status = filter.status;

      if (filter.status !== AppointmentStatus.CANCELLED) {
        where.deletedAt = null;
      }
    } else {
      where.deletedAt = null;
    }

    if (filter?.patientId) {
      where.patientId = filter.patientId;
    }

    if (filter?.nutritionistId) {
      where.nutritionistId = filter.nutritionistId;
    }

    if (filter?.dateFrom || filter?.dateTo) {
      where.scheduledAt = {
        gte: filter.dateFrom,
        lte: filter.dateTo,
      };
    }

    if (filter?.search?.trim()) {
      const search = filter.search.trim();
      where.OR = [
        { reason: { contains: search, mode: 'insensitive' } },
        { notes: { contains: search, mode: 'insensitive' } },
        { patient: { firstName: { contains: search, mode: 'insensitive' } } },
        { patient: { lastName: { contains: search, mode: 'insensitive' } } },
        {
          nutritionist: {
            firstName: { contains: search, mode: 'insensitive' },
          },
        },
        {
          nutritionist: {
            lastName: { contains: search, mode: 'insensitive' },
          },
        },
      ];
    }

    return where;
  }

  private async findRecordById(currentUser: DemoCurrentUser, id: string) {
    const appointment = await this.prisma.appointment.findFirst({
      where: {
        id,
        tenantId: currentUser.tenantId,
      },
      include: this.includePeople(),
    });

    if (!appointment) {
      throw new NotFoundException(
        'Appointment was not found in the current tenant.',
      );
    }

    return appointment;
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

  private async ensureNutritionistHasNoConflict(input: {
    tenantId: string;
    nutritionistId: string;
    scheduledAt: Date;
    durationMinutes: number;
    excludeAppointmentId?: string;
  }) {
    const nextStart = input.scheduledAt;
    const nextEnd = new Date(
      input.scheduledAt.getTime() + input.durationMinutes * 60 * 1000,
    );

    const candidates = await this.prisma.appointment.findMany({
      where: {
        tenantId: input.tenantId,
        nutritionistId: input.nutritionistId,
        status: {
          in: activeConflictStatuses,
        },
        deletedAt: null,
        scheduledAt: {
          lt: nextEnd,
        },
        id: input.excludeAppointmentId
          ? {
              not: input.excludeAppointmentId,
            }
          : undefined,
      },
    });

    const hasConflict = candidates.some((appointment) => {
      const currentStart = appointment.scheduledAt;
      const currentEnd = new Date(
        appointment.scheduledAt.getTime() +
          appointment.durationMinutes * 60 * 1000,
      );

      return currentStart < nextEnd && currentEnd > nextStart;
    });

    if (hasConflict) {
      throw new ConflictException(
        'Nutritionist already has an active appointment in this time range.',
      );
    }
  }

  private ensureValidSchedule(scheduledAt: Date, durationMinutes: number) {
    if (!(scheduledAt instanceof Date) || Number.isNaN(scheduledAt.getTime())) {
      throw new BadRequestException('scheduledAt must be a valid date.');
    }

    if (durationMinutes <= 0) {
      throw new BadRequestException(
        'durationMinutes must be greater than zero.',
      );
    }
  }

  private includePeople() {
    return {
      patient: true,
      nutritionist: true,
    } as const;
  }

  private mapAppointment(appointment: AppointmentWithPeople) {
    return {
      ...appointment,
      patientFullName: `${appointment.patient.firstName} ${appointment.patient.lastName}`,
      nutritionistFullName: `${appointment.nutritionist.firstName} ${appointment.nutritionist.lastName}`,
    };
  }
}
