CREATE TYPE "AppointmentStatus" AS ENUM ('SCHEDULED', 'CONFIRMED', 'COMPLETED', 'CANCELLED', 'RESCHEDULED', 'NO_SHOW');

CREATE TYPE "AppointmentMode" AS ENUM ('IN_PERSON', 'VIRTUAL');

CREATE TABLE "appointments" (
  "id" TEXT NOT NULL,
  "tenant_id" TEXT NOT NULL,
  "patient_id" TEXT NOT NULL,
  "nutritionist_id" TEXT NOT NULL,
  "scheduled_at" TIMESTAMP(3) NOT NULL,
  "duration_minutes" INTEGER NOT NULL,
  "status" "AppointmentStatus" NOT NULL DEFAULT 'SCHEDULED',
  "mode" "AppointmentMode" NOT NULL DEFAULT 'IN_PERSON',
  "reason" TEXT,
  "notes" TEXT,
  "cancel_reason" TEXT,
  "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updated_at" TIMESTAMP(3) NOT NULL,
  "deleted_at" TIMESTAMP(3),

  CONSTRAINT "appointments_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX "appointments_tenant_id_patient_id_scheduled_at_key" ON "appointments"("tenant_id", "patient_id", "scheduled_at");
CREATE INDEX "appointments_tenant_id_scheduled_at_idx" ON "appointments"("tenant_id", "scheduled_at");
CREATE INDEX "appointments_tenant_id_nutritionist_id_scheduled_at_idx" ON "appointments"("tenant_id", "nutritionist_id", "scheduled_at");
CREATE INDEX "appointments_tenant_id_patient_id_scheduled_at_idx" ON "appointments"("tenant_id", "patient_id", "scheduled_at");
CREATE INDEX "appointments_tenant_id_status_idx" ON "appointments"("tenant_id", "status");

ALTER TABLE "appointments" ADD CONSTRAINT "appointments_tenant_id_fkey" FOREIGN KEY ("tenant_id") REFERENCES "tenants"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE "appointments" ADD CONSTRAINT "appointments_patient_id_fkey" FOREIGN KEY ("patient_id") REFERENCES "patients"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE "appointments" ADD CONSTRAINT "appointments_nutritionist_id_fkey" FOREIGN KEY ("nutritionist_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
