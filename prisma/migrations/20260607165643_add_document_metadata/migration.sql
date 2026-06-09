-- CreateTable
CREATE TABLE "document_metadata" (
    "id" TEXT NOT NULL,
    "tenant_id" TEXT NOT NULL,
    "patient_id" TEXT NOT NULL,
    "nutritionist_id" TEXT NOT NULL,
    "resource_id" TEXT,
    "tipo_documento" TEXT NOT NULL,
    "nombre_archivo" TEXT NOT NULL,
    "paciente_nombre" TEXT,
    "nutricionista_nombre" TEXT,
    "s3_url" TEXT,
    "hash_documento" TEXT,
    "estado" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "document_metadata_pkey" PRIMARY KEY ("id")
);
