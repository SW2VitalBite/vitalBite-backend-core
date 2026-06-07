import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { createHash } from 'crypto';
import { Prisma } from '../../prisma/generated-client';
import { PrismaService } from '../../prisma/prisma.service';
import { AuthenticatedUser } from '../auth/auth.types';
import {
  PatientRiskPredictionModel,
  PatientRiskPredictionStatus,
} from './models/patient-risk-prediction.model';

const MODEL_VERSION = 'risk-rf-v1';
const DEFAULT_LEVEL_ACTIVITY = 2;
const DEFAULT_DIET_QUALITY_SCORE = 5;
const DEFAULT_COMORBIDITIES = 0;

interface RiskFeatures {
  edad: number | null;
  sexo: number | null;
  peso_kg: number | null;
  talla_m: number | null;
  imc: number | null;
  variacion_peso_3m_kg: number;
  porcentaje_grasa: number | null;
  nivel_actividad: number;
  calidad_dieta_score: number;
  num_comorbilidades: number;
}

interface AiRiskPredictionResponse {
  nivel_riesgo: string;
  probabilidad: number;
  probabilidades: Record<string, number>;
  factores_criticos: string[];
  recomendacion: string;
}

@Injectable()
export class RiskPredictionsService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly configService: ConfigService,
  ) {}

  async predictForPatient(
    currentUser: AuthenticatedUser,
    patientId: string,
  ): Promise<PatientRiskPredictionModel> {
    const patient = await this.prisma.patient.findFirst({
      where: {
        id: patientId,
        tenantId: currentUser.tenantId,
        deletedAt: null,
      },
    });

    if (!patient) {
      return this.unavailable();
    }

    const latestMeasurement = await this.prisma.bodyMeasurement.findFirst({
      where: {
        tenantId: currentUser.tenantId,
        patientId,
        deletedAt: null,
      },
      orderBy: {
        measuredAt: 'desc',
      },
    });

    const latestComposition = await this.prisma.bodyComposition.findFirst({
      where: {
        tenantId: currentUser.tenantId,
        patientId,
        deletedAt: null,
      },
      orderBy: {
        measuredAt: 'desc',
      },
    });

    const features = await this.buildFeatures(patient, latestMeasurement, latestComposition);

    if (!features.edad || !features.peso_kg || !features.talla_m) {
      return {
        status: PatientRiskPredictionStatus.INSUFFICIENT_DATA,
        factoresCriticos: [],
      };
    }

    const fingerprint = this.createFingerprint({
      features,
      sourceMeasurementId: latestMeasurement?.id ?? null,
      sourceCompositionId: latestComposition?.id ?? null,
    });

    const existing = await this.prisma.riskPrediction.findFirst({
      where: {
        tenantId: currentUser.tenantId,
        patientId,
        featuresFingerprint: fingerprint,
        modelVersion: MODEL_VERSION,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    if (existing) {
      return this.toModel(existing, PatientRiskPredictionStatus.REUSED);
    }

    const aiResponse = await this.requestAiPrediction(
      patientId,
      currentUser.tenantId,
      features,
    );

    if (!aiResponse) {
      return this.unavailable();
    }

    const saved = await this.prisma.riskPrediction.create({
      data: {
        tenantId: currentUser.tenantId,
        patientId,
        requestedById: currentUser.id,
        features: features as unknown as Prisma.InputJsonValue,
        featuresFingerprint: fingerprint,
        modelVersion: MODEL_VERSION,
        nivelRiesgo: aiResponse.nivel_riesgo,
        probabilidad: aiResponse.probabilidad,
        probabilidades: aiResponse.probabilidades as Prisma.InputJsonValue,
        factoresCriticos: aiResponse.factores_criticos as Prisma.InputJsonValue,
        recomendacion: aiResponse.recomendacion,
        sourceMeasurementId: latestMeasurement?.id ?? null,
        sourceCompositionId: latestComposition?.id ?? null,
      },
    });

    return this.toModel(saved, PatientRiskPredictionStatus.SUCCESS);
  }

  private async buildFeatures(
    patient: {
      birthDate: Date | null;
      gender: string | null;
      activityLevel: number | null;
      dietQualityScore: number | null;
      comorbiditiesCount: number | null;
      heightCm: number | null;
      tenantId: string;
      id: string;
    },
    latestMeasurement: {
      id: string;
      measuredAt: Date;
      weightKg: number;
      heightCm: number | null;
      bmi: number | null;
    } | null,
    latestComposition: {
      bodyFatPercentage: number | null;
    } | null,
  ): Promise<RiskFeatures> {
    const heightCm = latestMeasurement?.heightCm ?? patient.heightCm ?? null;
    const weightKg = latestMeasurement?.weightKg ?? null;
    const heightM = heightCm ? Number((heightCm / 100).toFixed(2)) : null;
    const bmi =
      latestMeasurement?.bmi ??
      (weightKg && heightM ? Number((weightKg / (heightM * heightM)).toFixed(2)) : null);

    return {
      edad: this.calculateAge(patient.birthDate),
      sexo: this.mapGender(patient.gender),
      peso_kg: weightKg,
      talla_m: heightM,
      imc: bmi,
      variacion_peso_3m_kg: await this.calculateWeightVariation(patient, latestMeasurement),
      porcentaje_grasa: latestComposition?.bodyFatPercentage ?? null,
      nivel_actividad: patient.activityLevel ?? DEFAULT_LEVEL_ACTIVITY,
      calidad_dieta_score: patient.dietQualityScore ?? DEFAULT_DIET_QUALITY_SCORE,
      num_comorbilidades: patient.comorbiditiesCount ?? DEFAULT_COMORBIDITIES,
    };
  }

  private async calculateWeightVariation(
    patient: { tenantId: string; id: string },
    latestMeasurement: { measuredAt: Date; weightKg: number } | null,
  ) {
    if (!latestMeasurement) {
      return 0;
    }

    const target = new Date(latestMeasurement.measuredAt);
    target.setDate(target.getDate() - 90);

    const previousMeasurements = await this.prisma.bodyMeasurement.findMany({
      where: {
        tenantId: patient.tenantId,
        patientId: patient.id,
        deletedAt: null,
        measuredAt: {
          lt: latestMeasurement.measuredAt,
        },
      },
      orderBy: {
        measuredAt: 'desc',
      },
      take: 20,
    });

    if (!previousMeasurements.length) {
      return 0;
    }

    const closest = previousMeasurements.reduce((best, current) => {
      const bestDistance = Math.abs(best.measuredAt.getTime() - target.getTime());
      const currentDistance = Math.abs(current.measuredAt.getTime() - target.getTime());
      return currentDistance < bestDistance ? current : best;
    });

    return Number((latestMeasurement.weightKg - closest.weightKg).toFixed(2));
  }

  private async requestAiPrediction(
    patientId: string,
    tenantId: string,
    features: RiskFeatures,
  ) {
    const baseUrl = this.configService.get<string>('aiServiceUrl');
    const apiKey = this.configService.get<string>('aiApiKey');

    if (!baseUrl || !apiKey) {
      return null;
    }

    try {
      const response = await fetch(
        `${baseUrl.replace(/\/$/, '')}/api/v1/risk-prediction`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'X-API-Key': apiKey,
          },
          body: JSON.stringify({
            patient_id: patientId,
            tenant_id: tenantId,
            features,
          }),
        },
      );

      if (!response.ok) {
        return null;
      }

      return (await response.json()) as AiRiskPredictionResponse;
    } catch {
      return null;
    }
  }

  private calculateAge(birthDate?: Date | null) {
    if (!birthDate) {
      return null;
    }

    const today = new Date();
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      age -= 1;
    }
    return age;
  }

  private mapGender(gender?: string | null) {
    if (gender === 'FEMALE') {
      return 0;
    }
    if (gender === 'MALE') {
      return 1;
    }
    return null;
  }

  private createFingerprint(value: unknown) {
    return createHash('sha256')
      .update(this.stableStringify(value))
      .digest('hex');
  }

  private stableStringify(value: unknown): string {
    if (Array.isArray(value)) {
      return `[${value.map((item) => this.stableStringify(item)).join(',')}]`;
    }

    if (value && typeof value === 'object') {
      return `{${Object.entries(value)
        .sort(([left], [right]) => left.localeCompare(right))
        .map(([key, item]) => `${JSON.stringify(key)}:${this.stableStringify(item)}`)
        .join(',')}}`;
    }

    return JSON.stringify(value);
  }

  private toModel(
    riskPrediction: {
      nivelRiesgo: string;
      probabilidad: number;
      probabilidades: unknown;
      factoresCriticos: unknown;
      recomendacion: string;
      createdAt: Date;
      sourceMeasurementId: string | null;
      sourceCompositionId: string | null;
    },
    status: PatientRiskPredictionStatus,
  ): PatientRiskPredictionModel {
    return {
      status,
      nivelRiesgo: riskPrediction.nivelRiesgo,
      probabilidad: riskPrediction.probabilidad,
      probabilidades: riskPrediction.probabilidades as Record<string, number>,
      factoresCriticos: Array.isArray(riskPrediction.factoresCriticos)
        ? riskPrediction.factoresCriticos.map(String)
        : [],
      recomendacion: riskPrediction.recomendacion,
      createdAt: riskPrediction.createdAt,
      sourceMeasurementId: riskPrediction.sourceMeasurementId,
      sourceCompositionId: riskPrediction.sourceCompositionId,
    };
  }

  private unavailable(): PatientRiskPredictionModel {
    return {
      status: PatientRiskPredictionStatus.UNAVAILABLE,
      factoresCriticos: [],
    };
  }
}
