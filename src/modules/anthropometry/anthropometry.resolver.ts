import { Args, ID, Mutation, Query, Resolver } from '@nestjs/graphql';
import { AuthContextService } from '../auth/auth-context.service';
import { AnthropometryMeasurementModel } from './models/anthropometry-measurement.model';
import { AnthropometryService } from './anthropometry.service';
import { AnthropometryMeasurementFilterInput } from './dto/anthropometry-measurement-filter.input';
import { CreateAnthropometryMeasurementInput } from './dto/create-anthropometry-measurement.input';
import { UpdateAnthropometryMeasurementInput } from './dto/update-anthropometry-measurement.input';

@Resolver(() => AnthropometryMeasurementModel)
export class AnthropometryResolver {
  constructor(
    private readonly authContext: AuthContextService,
    private readonly anthropometryService: AnthropometryService,
  ) {}

  @Query(() => [AnthropometryMeasurementModel])
  async anthropometryByPatient(
    @Args('patientId', { type: () => ID }) patientId: string,
    @Args('filter', { nullable: true })
    filter?: AnthropometryMeasurementFilterInput,
  ) {
    const currentUser = await this.authContext.getCurrentUser();
    return this.anthropometryService.findByPatient(
      currentUser,
      patientId,
      filter,
    );
  }

  @Query(() => AnthropometryMeasurementModel)
  async anthropometryMeasurementById(
    @Args('id', { type: () => ID }) id: string,
  ) {
    const currentUser = await this.authContext.getCurrentUser();
    return this.anthropometryService.findById(currentUser, id);
  }

  @Mutation(() => AnthropometryMeasurementModel)
  async createAnthropometryMeasurement(
    @Args('input') input: CreateAnthropometryMeasurementInput,
  ) {
    const currentUser = await this.authContext.getCurrentUser();
    return this.anthropometryService.create(currentUser, input);
  }

  @Mutation(() => AnthropometryMeasurementModel)
  async updateAnthropometryMeasurement(
    @Args('id', { type: () => ID }) id: string,
    @Args('input') input: UpdateAnthropometryMeasurementInput,
  ) {
    const currentUser = await this.authContext.getCurrentUser();
    return this.anthropometryService.update(currentUser, id, input);
  }

  @Mutation(() => AnthropometryMeasurementModel)
  async deleteAnthropometryMeasurement(
    @Args('id', { type: () => ID }) id: string,
  ) {
    const currentUser = await this.authContext.getCurrentUser();
    return this.anthropometryService.delete(currentUser, id);
  }
}
