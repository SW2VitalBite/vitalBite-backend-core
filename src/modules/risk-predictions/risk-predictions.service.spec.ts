/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import { TenantStatus, UserStatus } from '../../prisma/generated-client';
import { PatientRiskPredictionStatus } from './models/patient-risk-prediction.model';
import { RiskPredictionsService } from './risk-predictions.service';

describe('RiskPredictionsService', () => {
  const currentUser = {
    id: '11111111-1111-1111-1111-111111111111',
    tenantId: '22222222-2222-2222-2222-222222222222',
    email: 'elena.cruz@gmail.com',
    firstName: 'Elena',
    lastName: 'Cruz',
    status: UserStatus.ACTIVE,
    roleCode: 'NUTRICIONISTA',
    createdAt: new Date(),
    updatedAt: new Date(),
    deletedAt: null,
    tenant: {
      id: '22222222-2222-2222-2222-222222222222',
      name: 'Clinica Central',
      slug: 'clinica-central',
      status: TenantStatus.ACTIVE,
      createdAt: new Date(),
      updatedAt: new Date(),
      deletedAt: null,
    },
  };

  const patient = {
    id: '33333333-3333-3333-3333-333333333333',
    tenantId: currentUser.tenantId,
    birthDate: new Date('1990-01-10T00:00:00.000Z'),
    gender: 'FEMALE',
    activityLevel: 3,
    dietQualityScore: 7.5,
    comorbiditiesCount: 2,
    heightCm: 165,
    deletedAt: null,
  };

  const latestMeasurement = {
    id: '44444444-4444-4444-4444-444444444444',
    tenantId: currentUser.tenantId,
    patientId: patient.id,
    measuredAt: new Date('2026-06-01T09:00:00.000Z'),
    weightKg: 72,
    heightCm: null,
    bmi: null,
    deletedAt: null,
  };

  const previousMeasurement = {
    ...latestMeasurement,
    id: '55555555-5555-5555-5555-555555555555',
    measuredAt: new Date('2026-03-05T09:00:00.000Z'),
    weightKg: 69.5,
  };

  const latestComposition = {
    id: '66666666-6666-6666-6666-666666666666',
    tenantId: currentUser.tenantId,
    patientId: patient.id,
    bodyFatPercentage: 31,
    measuredAt: new Date('2026-06-01T09:00:00.000Z'),
    deletedAt: null,
  };

  const aiResponse = {
    nivel_riesgo: 'Medio',
    probabilidad: 0.64,
    probabilidades: { Bajo: 0.2, Medio: 0.64, Alto: 0.16 },
    factores_criticos: ['Indice de Masa Corporal elevado'],
    recomendacion: 'Ajustar plan dietetico y seguimiento mensual.',
  };

  const config = {
    get: jest.fn((key: string) => {
      if (key === 'aiServiceUrl') return 'http://localhost:8001';
      if (key === 'aiApiKey') return 'test-api-key';
      return undefined;
    }),
  };

  const createPrismaMock = () => ({
    patient: {
      findFirst: jest.fn().mockResolvedValue(patient),
    },
    bodyMeasurement: {
      findFirst: jest.fn().mockResolvedValue(latestMeasurement),
      findMany: jest.fn().mockResolvedValue([previousMeasurement]),
    },
    bodyComposition: {
      findFirst: jest.fn().mockResolvedValue(latestComposition),
    },
    riskPrediction: {
      findFirst: jest.fn().mockResolvedValue(null),
      create: jest.fn().mockImplementation((args) =>
        Promise.resolve({
          ...args.data,
          createdAt: new Date('2026-06-07T10:00:00.000Z'),
        }),
      ),
    },
  });

  beforeEach(() => {
    global.fetch = jest.fn().mockResolvedValue({
      ok: true,
      json: jest.fn().mockResolvedValue(aiResponse),
    } as unknown as Response);
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('builds features, calls FastAPI and stores the successful prediction', async () => {
    const prisma = createPrismaMock();
    const service = new RiskPredictionsService(prisma as any, config as any);

    const result = await service.predictForPatient(currentUser, patient.id);

    expect(result.status).toBe(PatientRiskPredictionStatus.SUCCESS);
    expect(result.nivelRiesgo).toBe('Medio');
    expect(global.fetch).toHaveBeenCalledWith(
      'http://localhost:8001/api/v1/risk-prediction',
      expect.objectContaining({
        method: 'POST',
        headers: expect.objectContaining({
          'X-API-Key': 'test-api-key',
        }),
      }),
    );
    const request = JSON.parse((global.fetch as jest.Mock).mock.calls[0][1].body);
    expect(request.features).toEqual(
      expect.objectContaining({
        sexo: 0,
        peso_kg: 72,
        talla_m: 1.65,
        variacion_peso_3m_kg: 2.5,
        porcentaje_grasa: 31,
        nivel_actividad: 3,
        calidad_dieta_score: 7.5,
        num_comorbilidades: 2,
      }),
    );
    expect(prisma.riskPrediction.create).toHaveBeenCalled();
  });

  it('reuses an existing prediction with the same fingerprint', async () => {
    const prisma = createPrismaMock();
    prisma.riskPrediction.findFirst.mockResolvedValue({
      nivelRiesgo: 'Bajo',
      probabilidad: 0.82,
      probabilidades: { Bajo: 0.82, Medio: 0.12, Alto: 0.06 },
      factoresCriticos: ['Perfil clinico general'],
      recomendacion: 'Mantener monitoreo preventivo.',
      createdAt: new Date('2026-06-07T10:00:00.000Z'),
      sourceMeasurementId: latestMeasurement.id,
      sourceCompositionId: latestComposition.id,
    });
    const service = new RiskPredictionsService(prisma as any, config as any);

    const result = await service.predictForPatient(currentUser, patient.id);

    expect(result.status).toBe(PatientRiskPredictionStatus.REUSED);
    expect(global.fetch).not.toHaveBeenCalled();
    expect(prisma.riskPrediction.create).not.toHaveBeenCalled();
  });

  it('returns insufficient data without calling FastAPI', async () => {
    const prisma = createPrismaMock();
    prisma.bodyMeasurement.findFirst.mockResolvedValue(null);
    const service = new RiskPredictionsService(prisma as any, config as any);

    const result = await service.predictForPatient(currentUser, patient.id);

    expect(result.status).toBe(PatientRiskPredictionStatus.INSUFFICIENT_DATA);
    expect(global.fetch).not.toHaveBeenCalled();
  });

  it('returns unavailable when FastAPI fails', async () => {
    const prisma = createPrismaMock();
    (global.fetch as jest.Mock).mockRejectedValue(new Error('down'));
    const service = new RiskPredictionsService(prisma as any, config as any);

    const result = await service.predictForPatient(currentUser, patient.id);

    expect(result.status).toBe(PatientRiskPredictionStatus.UNAVAILABLE);
    expect(prisma.riskPrediction.create).not.toHaveBeenCalled();
  });
});
