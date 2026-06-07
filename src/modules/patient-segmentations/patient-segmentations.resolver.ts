import { Mutation, Query, Resolver } from '@nestjs/graphql';
import { AuthContextService } from '../auth/auth-context.service';
import { PatientSegmentationModel } from './models/patient-segmentation.model';
import { PatientSegmentationsService } from './patient-segmentations.service';

@Resolver(() => PatientSegmentationModel)
export class PatientSegmentationsResolver {
  constructor(
    private readonly authContext: AuthContextService,
    private readonly segmentationsService: PatientSegmentationsService,
  ) {}

  @Mutation(() => PatientSegmentationModel)
  async analyzeTenantSegmentation(): Promise<PatientSegmentationModel> {
    const currentUser = await this.authContext.getCurrentUser();
    return this.segmentationsService.analyzeTenantSegmentation(currentUser);
  }

  @Query(() => PatientSegmentationModel, { nullable: true })
  async latestTenantSegmentation(): Promise<PatientSegmentationModel | null> {
    const currentUser = await this.authContext.getCurrentUser();
    return this.segmentationsService.getLatestSegmentation(currentUser);
  }
}

