-- CreateEnum
CREATE TYPE "NotificationType" AS ENUM ('CITA_CREADA', 'CITA_CANCELADA', 'CITA_CONFIRMADA', 'CITA_REPROGRAMADA', 'DIETA_ASIGNADA', 'MENSAJE', 'REPORTE');

-- AlterTable
ALTER TABLE "patients" ADD COLUMN     "expo_push_token" TEXT,
ADD COLUMN     "height_cm" DOUBLE PRECISION;

-- CreateTable
CREATE TABLE "notifications" (
    "id" TEXT NOT NULL,
    "tenant_id" TEXT NOT NULL,
    "patient_id" TEXT NOT NULL,
    "type" "NotificationType" NOT NULL,
    "title" TEXT NOT NULL,
    "body" TEXT NOT NULL,
    "data" JSONB,
    "is_read" BOOLEAN NOT NULL DEFAULT false,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "notifications_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "notifications_tenant_id_patient_id_is_read_idx" ON "notifications"("tenant_id", "patient_id", "is_read");

-- CreateIndex
CREATE INDEX "notifications_tenant_id_patient_id_created_at_idx" ON "notifications"("tenant_id", "patient_id", "created_at");

-- AddForeignKey
ALTER TABLE "notifications" ADD CONSTRAINT "notifications_tenant_id_fkey" FOREIGN KEY ("tenant_id") REFERENCES "tenants"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "notifications" ADD CONSTRAINT "notifications_patient_id_fkey" FOREIGN KEY ("patient_id") REFERENCES "patients"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
