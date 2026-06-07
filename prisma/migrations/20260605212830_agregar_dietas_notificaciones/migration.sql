-- CreateEnum
CREATE TYPE "MealType" AS ENUM ('DESAYUNO', 'ALMUERZO', 'CENA', 'MERIENDA');

-- CreateEnum
CREATE TYPE "NotificationType" AS ENUM ('CITA_CREADA', 'CITA_CANCELADA', 'CITA_CONFIRMADA', 'CITA_REPROGRAMADA', 'DIETA_ASIGNADA', 'MENSAJE', 'REPORTE');

-- AlterTable
ALTER TABLE "patients" ADD COLUMN     "expo_push_token" TEXT,
ADD COLUMN     "height_cm" DOUBLE PRECISION;

-- CreateTable
CREATE TABLE "diets" (
    "id" TEXT NOT NULL,
    "tenant_id" TEXT NOT NULL,
    "patient_id" TEXT NOT NULL,
    "nutritionist_id" TEXT NOT NULL,
    "appointment_id" TEXT,
    "name" TEXT NOT NULL,
    "objective" TEXT,
    "start_date" TIMESTAMP(3) NOT NULL,
    "end_date" TIMESTAMP(3),
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "pdf_url" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "deleted_at" TIMESTAMP(3),

    CONSTRAINT "diets_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "diet_meals" (
    "id" TEXT NOT NULL,
    "diet_id" TEXT NOT NULL,
    "meal_type" "MealType" NOT NULL,
    "name" TEXT,

    CONSTRAINT "diet_meals_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "diet_items" (
    "id" TEXT NOT NULL,
    "meal_id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "quantity" DOUBLE PRECISION NOT NULL,
    "unit" TEXT NOT NULL,
    "calories" DOUBLE PRECISION,
    "protein" DOUBLE PRECISION,
    "carbs" DOUBLE PRECISION,
    "fat" DOUBLE PRECISION,

    CONSTRAINT "diet_items_pkey" PRIMARY KEY ("id")
);

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
CREATE INDEX "diets_tenant_id_patient_id_idx" ON "diets"("tenant_id", "patient_id");

-- CreateIndex
CREATE INDEX "diets_tenant_id_patient_id_is_active_idx" ON "diets"("tenant_id", "patient_id", "is_active");

-- CreateIndex
CREATE INDEX "notifications_tenant_id_patient_id_is_read_idx" ON "notifications"("tenant_id", "patient_id", "is_read");

-- CreateIndex
CREATE INDEX "notifications_tenant_id_patient_id_created_at_idx" ON "notifications"("tenant_id", "patient_id", "created_at");

-- AddForeignKey
ALTER TABLE "diets" ADD CONSTRAINT "diets_tenant_id_fkey" FOREIGN KEY ("tenant_id") REFERENCES "tenants"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "diets" ADD CONSTRAINT "diets_patient_id_fkey" FOREIGN KEY ("patient_id") REFERENCES "patients"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "diets" ADD CONSTRAINT "diets_nutritionist_id_fkey" FOREIGN KEY ("nutritionist_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "diet_meals" ADD CONSTRAINT "diet_meals_diet_id_fkey" FOREIGN KEY ("diet_id") REFERENCES "diets"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "diet_items" ADD CONSTRAINT "diet_items_meal_id_fkey" FOREIGN KEY ("meal_id") REFERENCES "diet_meals"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "notifications" ADD CONSTRAINT "notifications_tenant_id_fkey" FOREIGN KEY ("tenant_id") REFERENCES "tenants"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "notifications" ADD CONSTRAINT "notifications_patient_id_fkey" FOREIGN KEY ("patient_id") REFERENCES "patients"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
