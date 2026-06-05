import { Args, ID, Mutation, Query, Resolver } from '@nestjs/graphql';
import { AuthContextService } from '../auth/auth-context.service';
import { BodyMeasurementsService } from './body-measurements.service';
import { BodyMeasurementFilterInput } from './dto/body-measurement-filter.input';
import { CreateBodyMeasurementInput } from './dto/create-body-measurement.input';
import { UpdateBodyMeasurementInput } from './dto/update-body-measurement.input';
import { BodyMeasurementModel } from './models/body-measurement.model';

@Resolver(() => BodyMeasurementModel)
export class BodyMeasurementsResolver {
  constructor(
    private readonly authContext: AuthContextService,
    private readonly bodyMeasurementsService: BodyMeasurementsService,
  ) {}

  @Query(() => [BodyMeasurementModel])
  async bodyMeasurementsByPatient(
    @Args('patientId', { type: () => ID }) patientId: string,
    @Args('filter', { nullable: true }) filter?: BodyMeasurementFilterInput,
  ) {
    const currentUser = await this.authContext.getCurrentUser();
    return this.bodyMeasurementsService.findByPatient(
      currentUser,
      patientId,
      filter,
    );
  }

  @Query(() => BodyMeasurementModel)
  async bodyMeasurementById(@Args('id', { type: () => ID }) id: string) {
    const currentUser = await this.authContext.getCurrentUser();
    return this.bodyMeasurementsService.findById(currentUser, id);
  }

  @Mutation(() => BodyMeasurementModel)
  async createBodyMeasurement(
    @Args('input') input: CreateBodyMeasurementInput,
  ) {
    const currentUser = await this.authContext.getCurrentUser();
    return this.bodyMeasurementsService.create(currentUser, input);
  }

  @Mutation(() => BodyMeasurementModel)
  async updateBodyMeasurement(
    @Args('id', { type: () => ID }) id: string,
    @Args('input') input: UpdateBodyMeasurementInput,
  ) {
    const currentUser = await this.authContext.getCurrentUser();
    return this.bodyMeasurementsService.update(currentUser, id, input);
  }

  @Mutation(() => BodyMeasurementModel)
  async deleteBodyMeasurement(@Args('id', { type: () => ID }) id: string) {
    const currentUser = await this.authContext.getCurrentUser();
    return this.bodyMeasurementsService.delete(currentUser, id);
  }
}
