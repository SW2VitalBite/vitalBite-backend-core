CREATE TABLE IF NOT EXISTS "nutritionist_schedules" (
    "id" TEXT NOT NULL DEFAULT gen_random_uuid(),
    "tenant_id" TEXT NOT NULL,
    "nutritionist_id" TEXT NOT NULL,
    "day_of_week" INTEGER NOT NULL,
    "start_time" TEXT NOT NULL,
    "end_time" TEXT NOT NULL,
    "is_available" BOOLEAN NOT NULL DEFAULT true,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "nutritionist_schedules_pkey" PRIMARY KEY ("id"),
    CONSTRAINT "nutritionist_schedules_tenant_id_fkey" FOREIGN KEY ("tenant_id") REFERENCES "tenants"("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "nutritionist_schedules_nutritionist_id_fkey" FOREIGN KEY ("nutritionist_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
CREATE UNIQUE INDEX IF NOT EXISTS "nutritionist_schedules_tenant_id_nutritionist_id_day_of_week_start_time_end_time_key" ON "nutritionist_schedules"("tenant_id", "nutritionist_id", "day_of_week", "start_time", "end_time");
CREATE INDEX IF NOT EXISTS "nutritionist_schedules_tenant_id_nutritionist_id_idx" ON "nutritionist_schedules"("tenant_id", "nutritionist_id");
