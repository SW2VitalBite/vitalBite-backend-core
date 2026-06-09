import { Args, ID, Query, Resolver } from '@nestjs/graphql';
import { AuthContextService } from '../auth/auth-context.service';
import { PatientRiskPredictionModel } from './models/patient-risk-prediction.model';
import { RiskPredictionsService } from './risk-predictions.service';

@Resolver(() => PatientRiskPredictionModel)
export class RiskPredictionsResolver {
  constructor(
    private readonly authContext: AuthContextService,
    private readonly riskPredictionsService: RiskPredictionsService,
  ) {}

  @Query(() => PatientRiskPredictionModel)
  async patientRiskPrediction(
    @Args('patientId', { type: () => ID }) patientId: string,
  ) {
    const currentUser = await this.authContext.getCurrentUser();
    return this.riskPredictionsService.predictForPatient(currentUser, patientId);
  }
}
