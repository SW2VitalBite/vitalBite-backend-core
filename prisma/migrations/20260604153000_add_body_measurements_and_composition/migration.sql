CREATE TABLE "body_measurements" (
  "id" TEXT NOT NULL,
  "tenant_id" TEXT NOT NULL,
  "patient_id" TEXT NOT NULL,
  "registered_by_id" TEXT NOT NULL,
  "measured_at" TIMESTAMP(3) NOT NULL,
  "weight_kg" DOUBLE PRECISION NOT NULL,
  "height_cm" DOUBLE PRECISION,
  "bmi" DOUBLE PRECISION,
  "waist_cm" DOUBLE PRECISION,
  "hip_cm" DOUBLE PRECISION,
  "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updated_at" TIMESTAMP(3) NOT NULL,
  "deleted_at" TIMESTAMP(3),

  CONSTRAINT "body_measurements_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "body_compositions" (
  "id" TEXT NOT NULL,
  "tenant_id" TEXT NOT NULL,
  "patient_id" TEXT NOT NULL,
  "body_measurement_id" TEXT,
  "measured_at" TIMESTAMP(3) NOT NULL,
  "body_fat_percentage" DOUBLE PRECISION,
  "muscle_mass_kg" DOUBLE PRECISION,
  "water_percentage" DOUBLE PRECISION,
  "visceral_fat_level" DOUBLE PRECISION,
  "bone_mass_kg" DOUBLE PRECISION,
  "metabolic_age" INTEGER,
  "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updated_at" TIMESTAMP(3) NOT NULL,
  "deleted_at" TIMESTAMP(3),

  CONSTRAINT "body_compositions_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX "body_measurements_tenant_id_patient_id_measured_at_key" ON "body_measurements"("tenant_id", "patient_id", "measured_at");
CREATE INDEX "body_measurements_tenant_id_patient_id_measured_at_idx" ON "body_measurements"("tenant_id", "patient_id", "measured_at");
CREATE INDEX "body_measurements_tenant_id_registered_by_id_idx" ON "body_measurements"("tenant_id", "registered_by_id");

CREATE UNIQUE INDEX "body_compositions_tenant_id_patient_id_measured_at_key" ON "body_compositions"("tenant_id", "patient_id", "measured_at");
CREATE INDEX "body_compositions_tenant_id_patient_id_measured_at_idx" ON "body_compositions"("tenant_id", "patient_id", "measured_at");
CREATE INDEX "body_compositions_body_measurement_id_idx" ON "body_compositions"("body_measurement_id");

ALTER TABLE "body_measurements" ADD CONSTRAINT "body_measurements_tenant_id_fkey" FOREIGN KEY ("tenant_id") REFERENCES "tenants"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE "body_measurements" ADD CONSTRAINT "body_measurements_patient_id_fkey" FOREIGN KEY ("patient_id") REFERENCES "patients"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE "body_measurements" ADD CONSTRAINT "body_measurements_registered_by_id_fkey" FOREIGN KEY ("registered_by_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

ALTER TABLE "body_compositions" ADD CONSTRAINT "body_compositions_tenant_id_fkey" FOREIGN KEY ("tenant_id") REFERENCES "tenants"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE "body_compositions" ADD CONSTRAINT "body_compositions_patient_id_fkey" FOREIGN KEY ("patient_id") REFERENCES "patients"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE "body_compositions" ADD CONSTRAINT "body_compositions_body_measurement_id_fkey" FOREIGN KEY ("body_measurement_id") REFERENCES "body_measurements"("id") ON DELETE SET NULL ON UPDATE CASCADE;
