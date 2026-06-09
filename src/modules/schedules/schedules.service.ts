import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { AuthenticatedUser } from '../auth/auth.types';
import { SaveScheduleInput } from './dto/save-schedule.input';
import { ScheduleModel } from './models/schedule.model';

@Injectable()
export class SchedulesService {
  constructor(private readonly prisma: PrismaService) {}

  async mySchedules(currentUser: AuthenticatedUser): Promise<ScheduleModel[]> {
    return this.prisma.nutritionistSchedule.findMany({
      where: {
        tenantId: currentUser.tenantId,
        nutritionistId: currentUser.id,
      },
      orderBy: [
        { dayOfWeek: 'asc' },
        { startTime: 'asc' }
      ]
    });
  }

  async saveSchedules(currentUser: AuthenticatedUser, inputs: SaveScheduleInput[]): Promise<ScheduleModel[]> {
    // Delete existing schedules for this user
    await this.prisma.nutritionistSchedule.deleteMany({
      where: {
        tenantId: currentUser.tenantId,
        nutritionistId: currentUser.id,
      }
    });

    // Create new ones
    if (inputs.length === 0) return [];

    await this.prisma.nutritionistSchedule.createMany({
      data: inputs.map(i => ({
        tenantId: currentUser.tenantId,
        nutritionistId: currentUser.id,
        dayOfWeek: i.dayOfWeek,
        startTime: i.startTime,
        endTime: i.endTime,
        isAvailable: true,
      }))
    });

    return this.mySchedules(currentUser);
  }
}

