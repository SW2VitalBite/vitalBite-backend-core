-- CreateTable
CREATE TABLE "patient_segmentations" (
    "id" TEXT NOT NULL,
    "tenant_id" TEXT NOT NULL,
    "requested_by_id" TEXT NOT NULL,
    "k_clusters" INTEGER NOT NULL,
    "total_patients" INTEGER NOT NULL,
    "silhouette_score" DOUBLE PRECISION,
    "clusters" JSONB NOT NULL,
    "pca_points" JSONB NOT NULL,
    "variance_explained" JSONB NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "patient_segmentations_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "patient_segmentations_tenant_id_created_at_idx" ON "patient_segmentations"("tenant_id", "created_at");

-- AddForeignKey
ALTER TABLE "patient_segmentations" ADD CONSTRAINT "patient_segmentations_tenant_id_fkey" FOREIGN KEY ("tenant_id") REFERENCES "tenants"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "patient_segmentations" ADD CONSTRAINT "patient_segmentations_requested_by_id_fkey" FOREIGN KEY ("requested_by_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- RenameIndex
ALTER INDEX "risk_predictions_tenant_id_patient_id_features_fingerprint_mode" RENAME TO "risk_predictions_tenant_id_patient_id_features_fingerprint__idx";
