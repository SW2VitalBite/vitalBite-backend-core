import {
  Injectable,
  Logger,
  ServiceUnavailableException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { AuthenticatedUser } from '../auth/auth.types';
import { DietsService } from '../diets/diets.service';
import { DietPlanModel } from '../diets/models/diet-plan.model';
import { DietPdfDocumentModel } from './models/diet-pdf-document.model';
import { PatientDocumentModel } from './models/patient-document.model';

/** Forma de `DocumentMetadata` tal como lo serializa el microservicio Spring Boot. */
interface DocumentMetadataResponse {
  id: string;
  nombreArchivo: string;
  tipoDocumento: string;
  tenantId?: string | null;
  patientId?: string | null;
  nutritionistId?: string | null;
  resourceId?: string | null;
  pacienteNombre?: string | null;
  nutricionistaNombre?: string | null;
  s3Url?: string | null;
  hashDocumento?: string | null;
  estado?: string | null;
  fechaCreacion?: string | null;
}

/** Forma de `DocumentResponseDTO` del microservicio Spring Boot. */
interface DocumentResponse {
  documentId: string;
  url: string;
  nombreArchivo: string;
  expiresIn?: number | null;
  mensaje?: string | null;
}

@Injectable()
export class DocumentalIntegrationService {
  private readonly logger = new Logger(DocumentalIntegrationService.name);

  constructor(
    private readonly configService: ConfigService,
    private readonly dietsService: DietsService,
  ) {}

  /** Documentos (facturas, dietas, …) de un paciente con URLs prefirmadas frescas. */
  async getPatientDocuments(
    currentUser: AuthenticatedUser,
    patientId: string,
  ): Promise<PatientDocumentModel[]> {
    const documents = await this.request<DocumentMetadataResponse[]>(
      `/documents/patient/${encodeURIComponent(patientId)}`,
    );

    return documents
      // Aislamiento multi-tenant: nunca devolvemos documentos de otro tenant.
      .filter(
        (doc) => !doc.tenantId || doc.tenantId === currentUser.tenantId,
      )
      .map((doc) => this.toPatientDocumentModel(doc));
  }

  /**
   * Devuelve la URL del PDF de una dieta. Reutiliza el PDF que el nutricionista
   * generó desde la web si existe; si no, lo genera al vuelo en el microservicio.
   */
  async getOrGenerateDietPdf(
    currentUser: AuthenticatedUser,
    dietId: string,
  ): Promise<DietPdfDocumentModel> {
    // Valida tenant/permiso y nos da la estructura completa de la dieta.
    const diet = await this.dietsService.findById(currentUser, dietId);

    const existing = await this.request<DocumentResponse | null>(
      `/documents/diet/${encodeURIComponent(dietId)}`,
      { allowNotFound: true },
    );

    if (existing) {
      return {
        documentId: existing.documentId,
        url: existing.url,
        fileName: existing.nombreArchivo,
        expiresIn: existing.expiresIn ?? null,
        generated: false,
      };
    }

    const created = await this.request<DocumentResponse>(
      '/documents/pdf/diet',
      {
        method: 'POST',
        body: JSON.stringify(this.toDietPdfRequest(diet)),
      },
    );

    return {
      documentId: created.documentId,
      url: created.url,
      fileName: created.nombreArchivo,
      expiresIn: created.expiresIn ?? null,
      generated: true,
    };
  }

  private toPatientDocumentModel(
    doc: DocumentMetadataResponse,
  ): PatientDocumentModel {
    return {
      id: doc.id,
      fileName: doc.nombreArchivo,
      type: doc.tipoDocumento,
      resourceId: doc.resourceId ?? null,
      url: doc.s3Url ?? null,
      patientFullName: doc.pacienteNombre ?? null,
      nutritionistFullName: doc.nutricionistaNombre ?? null,
      status: doc.estado ?? null,
      hash: doc.hashDocumento ?? null,
      createdAt: doc.fechaCreacion ? new Date(doc.fechaCreacion) : null,
    };
  }

  /** Aplana la dieta del Core al `DietPdfRequestDTO` que espera Spring Boot. */
  private toDietPdfRequest(diet: DietPlanModel) {
    return {
      id: diet.id,
      tenantId: diet.tenantId,
      patientId: diet.patientId,
      nutritionistId: diet.nutritionistId,
      name: diet.name,
      objective: diet.objective,
      phase: diet.phase ?? null,
      approach: diet.approach ?? null,
      startDate: this.toIsoDate(diet.startDate),
      endDate: this.toIsoDate(diet.endDate),
      status: diet.status,
      mealsPerDay: diet.mealsPerDay ?? null,
      mainRestriction: diet.mainRestriction ?? null,
      notes: diet.notes ?? null,
      estimatedCalories: diet.estimatedCalories ?? null,
      adherencePercent: diet.adherencePercent ?? null,
      patientFullName: diet.patientFullName,
      nutritionistFullName: diet.nutritionistFullName,
      days: [...(diet.days ?? [])]
        .sort((a, b) => a.dayOrder - b.dayOrder)
        .map((day) => ({
          id: day.id,
          dietPlanId: diet.id,
          dayLabel: day.dayLabel,
          dayOrder: day.dayOrder,
          meals: [...(day.meals ?? [])]
            .sort((a, b) => a.mealOrder - b.mealOrder)
            .map((meal) => ({
              id: meal.id,
              dietPlanDayId: day.id,
              name: meal.name,
              mealOrder: meal.mealOrder,
              targetCalories: meal.targetCalories ?? null,
              notes: meal.notes ?? null,
              items: [...(meal.items ?? [])]
                .sort((a, b) => a.itemOrder - b.itemOrder)
                .map((item) => ({
                  id: item.id,
                  dietMealId: meal.id,
                  name: item.name,
                  portion: item.portion ?? null,
                  calories: item.calories ?? null,
                  itemOrder: item.itemOrder,
                  notes: item.notes ?? null,
                })),
            })),
        })),
    };
  }

  private toIsoDate(value?: Date | null) {
    if (!value) return null;
    return new Date(value).toISOString().slice(0, 10);
  }

  private async request<T>(
    path: string,
    init: { method?: string; body?: string; allowNotFound?: boolean } = {},
  ): Promise<T> {
    const baseUrl = this.configService.get<string>('documentalServiceUrl');
    if (!baseUrl) {
      throw new ServiceUnavailableException('DOCUMENTAL_SERVICE_URL is not set.');
    }

    const url = `${baseUrl.replace(/\/$/, '')}${path}`;
    let response: Response;

    try {
      response = await fetch(url, {
        method: init.method ?? 'GET',
        headers: init.body ? { 'Content-Type': 'application/json' } : undefined,
        body: init.body,
      });
    } catch (error) {
      this.logger.error(`Documental service unreachable at ${url}: ${error}`);
      throw new ServiceUnavailableException(
        'Documental service is not available.',
      );
    }

    if (init.allowNotFound && response.status === 404) {
      return null as T;
    }

    if (!response.ok) {
      this.logger.error(
        `Documental service returned ${response.status} for ${url}`,
      );
      throw new ServiceUnavailableException(
        'Documental service returned an invalid response.',
      );
    }

    return (await response.json()) as T;
  }
}
