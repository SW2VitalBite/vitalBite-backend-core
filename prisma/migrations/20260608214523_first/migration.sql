-- AlterEnum
ALTER TYPE "AppointmentStatus" ADD VALUE 'PENDING';

-- CreateTable
CREATE TABLE "nutritionist_schedules" (
    "id" TEXT NOT NULL,
    "tenant_id" TEXT NOT NULL,
    "nutritionist_id" TEXT NOT NULL,
    "day_of_week" INTEGER NOT NULL,
    "start_time" TEXT NOT NULL,
    "end_time" TEXT NOT NULL,
    "is_available" BOOLEAN NOT NULL DEFAULT true,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "nutritionist_schedules_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "nutritionist_schedules_tenant_id_nutritionist_id_idx" ON "nutritionist_schedules"("tenant_id", "nutritionist_id");

-- CreateIndex
CREATE UNIQUE INDEX "nutritionist_schedules_tenant_id_nutritionist_id_day_of_wee_key" ON "nutritionist_schedules"("tenant_id", "nutritionist_id", "day_of_week", "start_time", "end_time");

-- AddForeignKey
ALTER TABLE "nutritionist_schedules" ADD CONSTRAINT "nutritionist_schedules_tenant_id_fkey" FOREIGN KEY ("tenant_id") REFERENCES "tenants"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "nutritionist_schedules" ADD CONSTRAINT "nutritionist_schedules_nutritionist_id_fkey" FOREIGN KEY ("nutritionist_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
