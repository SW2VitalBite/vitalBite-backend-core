-- AlterEnum
-- Nuevos tipos de notificación para los cambios de estado de cita
-- "completada" y "no asistió". Additivo y sin pérdida de datos.
ALTER TYPE "NotificationType" ADD VALUE 'CITA_COMPLETADA';
ALTER TYPE "NotificationType" ADD VALUE 'CITA_NO_ASISTIO';
