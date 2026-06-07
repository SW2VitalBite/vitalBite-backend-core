import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Prisma } from '../../prisma/generated-client';
import { PrismaService } from '../../prisma/prisma.service';
import { AuthenticatedUser } from '../auth/auth.types';
import { PatientSegmentationModel } from './models/patient-segmentation.model';

interface PatientFeatureInput {
  patient_id: string;
  imc: number | null;
  porcentaje_grasa: number | null;
  masa_muscular_kg: number | null;
  variacion_peso_3m: number | null;
  nivel_actividad: number | null;
  adherencia_dieta_pct: number | null;
  asistencia_citas_pct: number | null;
}

interface AiSegmentationResponse {
  k_clusters: number;
  clusters: any[];
  pca_points: any[];
  variance_explained: number[];
  silhouette_score: number | null;
  total_pacientes: number;
}

@Injectable()
export class PatientSegmentationsService {
  private readonly logger = new Logger(PatientSegmentationsService.name);

  constructor(
    private readonly prisma: PrismaService,
    private readonly configService: ConfigService,
  ) {}

  async analyzeTenantSegmentation(currentUser: AuthenticatedUser): Promise<PatientSegmentationModel> {
    const patients = await this.prisma.patient.findMany({
      where: {
        tenantId: currentUser.tenantId,
        status: 'ACTIVE',
        deletedAt: null,
      },
      include: {
        bodyMeasurements: {
          orderBy: { measuredAt: 'desc' },
          take: 20,
        },
        bodyCompositions: {
          orderBy: { measuredAt: 'desc' },
          take: 1,
        },
        dietPlans: {
          where: { status: 'ACTIVE' },
          orderBy: { createdAt: 'desc' },
          take: 1,
        },
        appointments: {
          orderBy: { scheduledAt: 'desc' },
        },
      },
    });

    if (patients.length === 0) {
      throw new Error('No hay pacientes activos para segmentar.');
    }

    const features: PatientFeatureInput[] = patients.map((p) => {
      const latestMeasurement = p.bodyMeasurements[0] ?? null;
      const latestComposition = p.bodyCompositions[0] ?? null;
      const latestDiet = p.dietPlans[0] ?? null;

      let weightVar = 0;
      if (latestMeasurement) {
        const target = new Date(latestMeasurement.measuredAt);
        target.setDate(target.getDate() - 90);
        if (p.bodyMeasurements.length > 1) {
          const closest = p.bodyMeasurements.reduce((best, current) => {
            const bestDist = Math.abs(best.measuredAt.getTime() - target.getTime());
            const currDist = Math.abs(current.measuredAt.getTime() - target.getTime());
            return currDist < bestDist ? current : best;
          });
          weightVar = Number((latestMeasurement.weightKg - closest.weightKg).toFixed(2));
        }
      }

      let attendancePct = 0;
      if (p.appointments.length > 0) {
        const pastAppointments = p.appointments.filter(
          (a) => a.scheduledAt.getTime() < Date.now(),
        );
        const attended = pastAppointments.filter((a) => a.status === 'COMPLETED').length;
        if (pastAppointments.length > 0) {
          attendancePct = (attended / pastAppointments.length) * 100;
        }
      }

      const rawImc =
        latestMeasurement?.bmi ??
        (latestMeasurement?.weightKg && latestMeasurement?.heightCm
          ? Number(
              (
                latestMeasurement.weightKg /
                Math.pow(latestMeasurement.heightCm / 100, 2)
              ).toFixed(2),
            )
          : null);

      const clamp = (val: number | null | undefined, min: number, max: number) => {
        if (val === null || val === undefined) return null;
        if (val < min) return min;
        if (val > max) return max;
        return val;
      };

      return {
        patient_id: p.id,
        imc: clamp(rawImc, 10, 70),
        porcentaje_grasa: clamp(latestComposition?.bodyFatPercentage, 3, 70),
        masa_muscular_kg: clamp(latestComposition?.muscleMassKg, 5, 100),
        variacion_peso_3m: clamp(weightVar, -50, 50),
        nivel_actividad: clamp(p.activityLevel ?? 2, 0, 4),
        adherencia_dieta_pct: clamp(latestDiet?.adherencePercent ?? 50, 0, 100),
        asistencia_citas_pct: clamp(attendancePct, 0, 100),
      };
    });

    const aiResponse = await this.requestAiSegmentation(currentUser.tenantId, features);

    if (!aiResponse) {
      throw new Error('Error al conectar con el motor de Inteligencia Artificial.');
    }

    const saved = await this.prisma.patientSegmentation.create({
      data: {
        tenantId: currentUser.tenantId,
        requestedById: currentUser.id,
        kClusters: aiResponse.k_clusters,
        totalPatients: aiResponse.total_pacientes,
        silhouetteScore: aiResponse.silhouette_score,
        clusters: aiResponse.clusters as Prisma.InputJsonValue,
        pcaPoints: aiResponse.pca_points as Prisma.InputJsonValue,
        varianceExplained: aiResponse.variance_explained as Prisma.InputJsonValue,
      },
    });

    return this.toModel(saved);
  }

  async getLatestSegmentation(currentUser: AuthenticatedUser): Promise<PatientSegmentationModel | null> {
    const latest = await this.prisma.patientSegmentation.findFirst({
      where: { tenantId: currentUser.tenantId },
      orderBy: { createdAt: 'desc' },
    });

    return latest ? this.toModel(latest) : null;
  }

  private async requestAiSegmentation(tenantId: string, patients: PatientFeatureInput[]) {
    const baseUrl = this.configService.get<string>('aiServiceUrl');
    const apiKey = this.configService.get<string>('aiApiKey');

    if (!baseUrl || !apiKey) {
      this.logger.error('Falta configuración de AI_SERVICE_URL o AI_API_KEY');
      return null;
    }

    try {
      const response = await fetch(`${baseUrl.replace(/\/$/, '')}/api/v1/segmentation`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-API-Key': apiKey,
        },
        body: JSON.stringify({ tenant_id: tenantId, patients }),
      });

      if (!response.ok) {
        const text = await response.text();
        this.logger.error(`AI API error: ${response.status} - ${text}`);
        return null;
      }

      return (await response.json()) as AiSegmentationResponse;
    } catch (err) {
      this.logger.error('Error invocando FastAPI:', err);
      return null;
    }
  }

  private toModel(record: any): PatientSegmentationModel {
    return {
      id: record.id,
      kClusters: record.kClusters,
      totalPatients: record.totalPatients,
      silhouetteScore: record.silhouetteScore,
      clusters: record.clusters,
      pcaPoints: record.pcaPoints,
      varianceExplained: record.varianceExplained,
      createdAt: record.createdAt,
    };
  }
}
