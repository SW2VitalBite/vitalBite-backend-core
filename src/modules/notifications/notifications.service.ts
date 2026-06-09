import { Injectable, Logger } from '@nestjs/common';
import { NotificationType, Prisma } from '../../prisma/generated-client';
import { PrismaService } from '../../prisma/prisma.service';
import { AuthenticatedUser } from '../auth/auth.types';

interface CreateNotificationPayload {
  tenantId: string;
  patientId: string;
  type: NotificationType;
  title: string;
  body: string;
  data?: Record<string, unknown>;
}

@Injectable()
export class NotificationsService {
  private readonly logger = new Logger(NotificationsService.name);

  constructor(private readonly prisma: PrismaService) {}

  async myNotifications(currentUser: AuthenticatedUser, patientId: string) {
    return this.prisma.notification.findMany({
      where: {
        tenantId: currentUser.tenantId,
        patientId,
      },
      orderBy: { createdAt: 'desc' },
      take: 50,
    });
  }

  async markRead(currentUser: AuthenticatedUser, id: string) {
    return this.prisma.notification.updateMany({
      where: { id, tenantId: currentUser.tenantId },
      data: { isRead: true },
    });
  }

  async markAllRead(currentUser: AuthenticatedUser, patientId: string) {
    return this.prisma.notification.updateMany({
      where: {
        tenantId: currentUser.tenantId,
        patientId,
        isRead: false,
      },
      data: { isRead: true },
    });
  }

  async unreadCount(currentUser: AuthenticatedUser, patientId: string) {
    return this.prisma.notification.count({
      where: {
        tenantId: currentUser.tenantId,
        patientId,
        isRead: false,
      },
    });
  }

  async createAndPush(payload: CreateNotificationPayload) {
    const notification = await this.prisma.notification.create({
      data: {
        tenantId: payload.tenantId,
        patientId: payload.patientId,
        type: payload.type,
        title: payload.title,
        body: payload.body,
        data: (payload.data ?? {}) as Prisma.InputJsonValue,
        isRead: false,
      },
    });

    // Enviar push notification via Expo si el paciente tiene token registrado
    const patient = await this.prisma.patient.findFirst({
      where: { id: payload.patientId },
      select: { expoPushToken: true },
    });

    if (patient?.expoPushToken) {
      await this.sendExpoPush(
        patient.expoPushToken,
        payload.title,
        payload.body,
        payload.data,
      );
    }

    return notification;
  }

  private async sendExpoPush(
    token: string,
    title: string,
    body: string,
    data?: Record<string, unknown>,
  ) {
    try {
      const response = await fetch('https://exp.host/--/api/v2/push/send', {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Accept-encoding': 'gzip, deflate',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          to: token,
          title,
          body,
          data: data ?? {},
          sound: 'default',
          priority: 'high',
          channelId: 'default',
        }),
      });

      if (!response.ok) {
        this.logger.warn(
          `Expo push HTTP ${response.status} para token ${token.slice(0, 20)}…`,
        );
        return;
      }

      // Expo responde 200 incluso cuando el ticket trae error (token inválido,
      // dispositivo no registrado, credenciales FCM faltantes, …). Hay que
      // revisar el ticket para saber si realmente se entregó.
      const result = (await response.json()) as {
        data?: { status: string; message?: string; details?: unknown };
      };
      const ticket = result?.data;
      if (ticket?.status === 'error') {
        this.logger.warn(
          `Expo push rechazado: ${ticket.message ?? 'error desconocido'} ` +
            `(${JSON.stringify(ticket.details ?? {})})`,
        );
      } else {
        this.logger.log(
          `Expo push aceptado para token ${token.slice(0, 20)}…`,
        );
      }
    } catch (err) {
      this.logger.error('Error enviando push notification via Expo', err);
    }
  }
}
