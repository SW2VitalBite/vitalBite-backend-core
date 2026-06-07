-- AlterTable: add optional password_hash column to patients
-- Allows patients to authenticate directly from the mobile app
ALTER TABLE "patients" ADD COLUMN "password_hash" TEXT;
