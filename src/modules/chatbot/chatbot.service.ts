import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { ChatbotValidationResponseModel, ChatbotAvailableSlotModel } from './models/chatbot-validation.model';
import { CreatePendingAppointmentInput } from './dto/create-pending-appointment.input';
import { AppointmentModel } from '../appointments/models/appointment.model';

@Injectable()
export class ChatbotService {
  constructor(private readonly prisma: PrismaService) {}

  /**
   * Normaliza un número de teléfono eliminando +, espacios y guiones
   * para comparación consistente (WhatsApp envía sin formato, la BD puede tener formato)
   */
  private normalizePhone(phone: string): string {
    return phone.replace(/[\s\-\+]/g, '');
  }

  async validatePatientByPhone(phone: string): Promise<ChatbotValidationResponseModel> {
    // 1. Normalizar el teléfono de entrada (WhatsApp envía sin + ni espacios)
    const normalizedPhone = this.normalizePhone(phone);

    // 2. Buscar paciente comparando teléfonos normalizados
    const patients = await this.prisma.patient.findMany({
      where: { status: 'ACTIVE' },
      include: { nutritionist: true },
    });

    const patient = patients.find(
      p => this.normalizePhone(p.phone || '') === normalizedPhone,
    );

    if (!patient) {
      return { exists: false };
    }

    // 2. Obtener horarios de la nutricionista
    const schedules = await this.prisma.nutritionistSchedule.findMany({
      where: {
        nutritionistId: patient.nutritionistId,
        isAvailable: true,
      },
    });

    // 3. Generar próximos slots (ej. para los próximos 7 días)
    const availableSlots: ChatbotAvailableSlotModel[] = [];
    const today = new Date();
    
    // Obtener citas existentes para ignorar esos slots
    const nextWeek = new Date(today);
    nextWeek.setDate(today.getDate() + 7);
    
    const existingAppointments = await this.prisma.appointment.findMany({
      where: {
        nutritionistId: patient.nutritionistId,
        scheduledAt: { gte: today, lte: nextWeek },
        status: { notIn: ['CANCELLED', 'NO_SHOW'] }
      }
    });

    // Lógica básica: iteramos los próximos 7 días
    for (let i = 1; i <= 7; i++) {
      const date = new Date(today);
      date.setDate(today.getDate() + i);
      const dayOfWeek = date.getDay(); // 0 = Sun, 1 = Mon...
      
      const daySchedules = schedules.filter(s => s.dayOfWeek === dayOfWeek);
      for (const schedule of daySchedules) {
        // Asumiendo slots de 30 mins (simplificado para el ejemplo)
        // Parsear startTime
        const [startHr, startMin] = schedule.startTime.split(':').map(Number);
        const [endHr, endMin] = schedule.endTime.split(':').map(Number);
        
        let currentSlot = new Date(date);
        currentSlot.setHours(startHr, startMin, 0, 0);
        
        const endSlot = new Date(date);
        endSlot.setHours(endHr, endMin, 0, 0);
        
        while (currentSlot.getTime() + 30 * 60000 <= endSlot.getTime()) {
          // Verificar si ya hay una cita
          const isBooked = existingAppointments.some(appt => {
            const apptTime = new Date(appt.scheduledAt).getTime();
            return apptTime === currentSlot.getTime();
          });
          
          if (!isBooked) {
            const dateStr = currentSlot.toISOString().split('T')[0];
            const timeStr = currentSlot.toTimeString().substring(0, 5);
            availableSlots.push({
              id: `slot_${dateStr}_${timeStr}`,
              date: dateStr,
              startTime: timeStr,
              endTime: new Date(currentSlot.getTime() + 30 * 60000).toTimeString().substring(0, 5),
            });
          }
          currentSlot = new Date(currentSlot.getTime() + 30 * 60000);
        }
      }
    }

    return {
      exists: true,
      patientId: patient.id,
      patientName: `${patient.firstName} ${patient.lastName}`,
      nutritionistId: patient.nutritionist.id,
      nutritionistName: `${patient.nutritionist.firstName} ${patient.nutritionist.lastName}`,
      availableSlots,
    };
  }

  async createPendingAppointment(input: CreatePendingAppointmentInput): Promise<AppointmentModel> {
    const normalizedPhone = this.normalizePhone(input.patientPhone);

    const patients = await this.prisma.patient.findMany({
      where: { status: 'ACTIVE' },
      include: { nutritionist: true },
    });

    const patient = patients.find(
      p => this.normalizePhone(p.phone || '') === normalizedPhone,
    );

    if (!patient) {
      throw new NotFoundException('Paciente no encontrado');
    }

    // slotId format: slot_YYYY-MM-DD_HH:mm
    const parts = input.slotId.split('_');
    if (parts.length !== 3) {
      throw new Error('ID de horario inválido');
    }
    
    const scheduledAt = new Date(`${parts[1]}T${parts[2]}:00.000Z`);

    const appointment = await this.prisma.appointment.create({
      data: {
        tenantId: patient.tenantId,
        patientId: patient.id,
        nutritionistId: patient.nutritionistId,
        scheduledAt,
        durationMinutes: 30, // Default for chatbot
        status: 'PENDING',
        mode: 'IN_PERSON',
        reason: 'Reservado por WhatsApp',
      },
      include: { patient: true, nutritionist: true },
    });

    return {
      ...appointment,
      patientFullName: `${appointment.patient.firstName} ${appointment.patient.lastName}`,
      nutritionistFullName: `${appointment.nutritionist.firstName} ${appointment.nutritionist.lastName}`,
    } as any;
  }
}

