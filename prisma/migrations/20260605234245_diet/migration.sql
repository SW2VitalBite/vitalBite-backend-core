-- CreateTable
CREATE TABLE "anthropometry_measurements" (
    "id" TEXT NOT NULL,
    "tenant_id" TEXT NOT NULL,
    "patient_id" TEXT NOT NULL,
    "body_measurement_id" TEXT,
    "measured_at" TIMESTAMP(3) NOT NULL,
    "neck_cm" DOUBLE PRECISION,
    "chest_thorax_cm" DOUBLE PRECISION,
    "right_arm_cm" DOUBLE PRECISION,
    "left_arm_cm" DOUBLE PRECISION,
    "right_forearm_cm" DOUBLE PRECISION,
    "left_forearm_cm" DOUBLE PRECISION,
    "waist_cm" DOUBLE PRECISION,
    "abdomen_cm" DOUBLE PRECISION,
    "hip_cm" DOUBLE PRECISION,
    "right_thigh_cm" DOUBLE PRECISION,
    "left_thigh_cm" DOUBLE PRECISION,
    "right_calf_cm" DOUBLE PRECISION,
    "left_calf_cm" DOUBLE PRECISION,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "deleted_at" TIMESTAMP(3),

    CONSTRAINT "anthropometry_measurements_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "anthropometry_measurements_tenant_id_patient_id_measured_at_idx" ON "anthropometry_measurements"("tenant_id", "patient_id", "measured_at");

-- CreateIndex
CREATE INDEX "anthropometry_measurements_body_measurement_id_idx" ON "anthropometry_measurements"("body_measurement_id");

-- AddForeignKey
ALTER TABLE "anthropometry_measurements" ADD CONSTRAINT "anthropometry_measurements_tenant_id_fkey" FOREIGN KEY ("tenant_id") REFERENCES "tenants"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "anthropometry_measurements" ADD CONSTRAINT "anthropometry_measurements_patient_id_fkey" FOREIGN KEY ("patient_id") REFERENCES "patients"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "anthropometry_measurements" ADD CONSTRAINT "anthropometry_measurements_body_measurement_id_fkey" FOREIGN KEY ("body_measurement_id") REFERENCES "body_measurements"("id") ON DELETE SET NULL ON UPDATE CASCADE;
