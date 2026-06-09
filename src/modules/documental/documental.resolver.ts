import { Args, ID, Mutation, Query, Resolver } from '@nestjs/graphql';
import { AuthContextService } from '../auth/auth-context.service';
import { DocumentalIntegrationService } from './documental-integration.service';
import { DietPdfDocumentModel } from './models/diet-pdf-document.model';
import { PatientDocumentModel } from './models/patient-document.model';

@Resolver(() => PatientDocumentModel)
export class DocumentalResolver {
  constructor(
    private readonly authContext: AuthContextService,
    private readonly documentalService: DocumentalIntegrationService,
  ) {}

  /** Documentos (facturas, dietas, …) almacenados en S3 para un paciente. */
  @Query(() => [PatientDocumentModel])
  async patientDocuments(
    @Args('patientId', { type: () => ID }) patientId: string,
  ) {
    const currentUser = await this.authContext.getCurrentUser();
    return this.documentalService.getPatientDocuments(currentUser, patientId);
  }

  /**
   * Recupera (o genera al vuelo) el PDF de un plan de dieta y devuelve su URL
   * prefirmada para que la app móvil pueda abrirlo/descargarlo.
   */
  @Mutation(() => DietPdfDocumentModel)
  async requestDietPdf(@Args('dietId', { type: () => ID }) dietId: string) {
    const currentUser = await this.authContext.getCurrentUser();
    return this.documentalService.getOrGenerateDietPdf(currentUser, dietId);
  }
}
