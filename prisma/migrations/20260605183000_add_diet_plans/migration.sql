CREATE TYPE "DietPlanStatus" AS ENUM ('ACTIVE', 'DRAFT', 'NEEDS_ADJUSTMENT');

CREATE TABLE "diet_plans" (
  "id" TEXT NOT NULL,
  "tenant_id" TEXT NOT NULL,
  "patient_id" TEXT NOT NULL,
  "nutritionist_id" TEXT NOT NULL,
  "name" TEXT NOT NULL,
  "objective" TEXT NOT NULL,
  "phase" TEXT,
  "approach" TEXT,
  "start_date" TIMESTAMP(3),
  "end_date" TIMESTAMP(3),
  "status" "DietPlanStatus" NOT NULL DEFAULT 'DRAFT',
  "meals_per_day" INTEGER,
  "main_restriction" TEXT,
  "notes" TEXT,
  "estimated_calories" INTEGER,
  "adherence_percent" INTEGER,
  "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updated_at" TIMESTAMP(3) NOT NULL,
  "deleted_at" TIMESTAMP(3),

  CONSTRAINT "diet_plans_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "diet_plan_days" (
  "id" TEXT NOT NULL,
  "diet_plan_id" TEXT NOT NULL,
  "day_label" TEXT NOT NULL,
  "day_order" INTEGER NOT NULL,
  "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updated_at" TIMESTAMP(3) NOT NULL,

  CONSTRAINT "diet_plan_days_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "diet_meals" (
  "id" TEXT NOT NULL,
  "diet_plan_day_id" TEXT NOT NULL,
  "name" TEXT NOT NULL,
  "meal_order" INTEGER NOT NULL,
  "target_calories" INTEGER,
  "notes" TEXT,
  "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updated_at" TIMESTAMP(3) NOT NULL,

  CONSTRAINT "diet_meals_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "diet_meal_items" (
  "id" TEXT NOT NULL,
  "diet_meal_id" TEXT NOT NULL,
  "name" TEXT NOT NULL,
  "portion" TEXT,
  "calories" INTEGER,
  "item_order" INTEGER NOT NULL,
  "notes" TEXT,
  "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updated_at" TIMESTAMP(3) NOT NULL,

  CONSTRAINT "diet_meal_items_pkey" PRIMARY KEY ("id")
);

CREATE INDEX "diet_plans_tenant_id_patient_id_status_idx" ON "diet_plans"("tenant_id", "patient_id", "status");
CREATE INDEX "diet_plans_tenant_id_nutritionist_id_idx" ON "diet_plans"("tenant_id", "nutritionist_id");
CREATE INDEX "diet_plans_tenant_id_status_idx" ON "diet_plans"("tenant_id", "status");
CREATE UNIQUE INDEX "diet_plan_days_diet_plan_id_day_order_key" ON "diet_plan_days"("diet_plan_id", "day_order");
CREATE UNIQUE INDEX "diet_meals_diet_plan_day_id_meal_order_key" ON "diet_meals"("diet_plan_day_id", "meal_order");
CREATE UNIQUE INDEX "diet_meal_items_diet_meal_id_item_order_key" ON "diet_meal_items"("diet_meal_id", "item_order");

ALTER TABLE "diet_plans" ADD CONSTRAINT "diet_plans_tenant_id_fkey" FOREIGN KEY ("tenant_id") REFERENCES "tenants"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE "diet_plans" ADD CONSTRAINT "diet_plans_patient_id_fkey" FOREIGN KEY ("patient_id") REFERENCES "patients"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE "diet_plans" ADD CONSTRAINT "diet_plans_nutritionist_id_fkey" FOREIGN KEY ("nutritionist_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE "diet_plan_days" ADD CONSTRAINT "diet_plan_days_diet_plan_id_fkey" FOREIGN KEY ("diet_plan_id") REFERENCES "diet_plans"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "diet_meals" ADD CONSTRAINT "diet_meals_diet_plan_day_id_fkey" FOREIGN KEY ("diet_plan_day_id") REFERENCES "diet_plan_days"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "diet_meal_items" ADD CONSTRAINT "diet_meal_items_diet_meal_id_fkey" FOREIGN KEY ("diet_meal_id") REFERENCES "diet_meals"("id") ON DELETE CASCADE ON UPDATE CASCADE;
