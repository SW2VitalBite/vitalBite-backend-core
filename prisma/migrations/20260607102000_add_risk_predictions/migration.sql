-- CreateTable
CREATE TABLE "risk_predictions" (
    "id" TEXT NOT NULL,
    "tenant_id" TEXT NOT NULL,
    "patient_id" TEXT NOT NULL,
    "requested_by_id" TEXT NOT NULL,
    "features" JSONB NOT NULL,
    "features_fingerprint" TEXT NOT NULL,
    "model_version" TEXT NOT NULL,
    "nivel_riesgo" TEXT NOT NULL,
    "probabilidad" DOUBLE PRECISION NOT NULL,
    "probabilidades" JSONB NOT NULL,
    "factores_criticos" JSONB NOT NULL,
    "recomendacion" TEXT NOT NULL,
    "source_measurement_id" TEXT,
    "source_composition_id" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "risk_predictions_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "risk_predictions_tenant_id_patient_id_created_at_idx" ON "risk_predictions"("tenant_id", "patient_id", "created_at");

-- CreateIndex
CREATE INDEX "risk_predictions_tenant_id_patient_id_features_fingerprint_model_version_idx" ON "risk_predictions"("tenant_id", "patient_id", "features_fingerprint", "model_version");

-- CreateIndex
CREATE INDEX "risk_predictions_source_measurement_id_idx" ON "risk_predictions"("source_measurement_id");

-- CreateIndex
CREATE INDEX "risk_predictions_source_composition_id_idx" ON "risk_predictions"("source_composition_id");

-- AddForeignKey
ALTER TABLE "risk_predictions" ADD CONSTRAINT "risk_predictions_tenant_id_fkey" FOREIGN KEY ("tenant_id") REFERENCES "tenants"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "risk_predictions" ADD CONSTRAINT "risk_predictions_patient_id_fkey" FOREIGN KEY ("patient_id") REFERENCES "patients"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "risk_predictions" ADD CONSTRAINT "risk_predictions_requested_by_id_fkey" FOREIGN KEY ("requested_by_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "risk_predictions" ADD CONSTRAINT "risk_predictions_source_measurement_id_fkey" FOREIGN KEY ("source_measurement_id") REFERENCES "body_measurements"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "risk_predictions" ADD CONSTRAINT "risk_predictions_source_composition_id_fkey" FOREIGN KEY ("source_composition_id") REFERENCES "body_compositions"("id") ON DELETE SET NULL ON UPDATE CASCADE;
