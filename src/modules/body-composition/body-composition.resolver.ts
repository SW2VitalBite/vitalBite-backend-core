import { Args, ID, Mutation, Query, Resolver } from '@nestjs/graphql';
import { DemoContextService } from '../demo-context/demo-context.service';
import { BodyCompositionService } from './body-composition.service';
import { CreateBodyCompositionInput } from './dto/create-body-composition.input';
import { UpdateBodyCompositionInput } from './dto/update-body-composition.input';
import { BodyCompositionModel } from './models/body-composition.model';

@Resolver(() => BodyCompositionModel)
export class BodyCompositionResolver {
  constructor(
    private readonly demoContext: DemoContextService,
    private readonly bodyCompositionService: BodyCompositionService,
  ) {}

  @Query(() => [BodyCompositionModel])
  async bodyCompositionByPatient(
    @Args('patientId', { type: () => ID }) patientId: string,
  ) {
    const currentUser = await this.demoContext.getCurrentUser();
    return this.bodyCompositionService.findByPatient(currentUser, patientId);
  }

  @Query(() => BodyCompositionModel)
  async latestBodyComposition(
    @Args('patientId', { type: () => ID }) patientId: string,
  ) {
    const currentUser = await this.demoContext.getCurrentUser();
    return this.bodyCompositionService.findLatestByPatient(
      currentUser,
      patientId,
    );
  }

  @Mutation(() => BodyCompositionModel)
  async createBodyComposition(
    @Args('input') input: CreateBodyCompositionInput,
  ) {
    const currentUser = await this.demoContext.getCurrentUser();
    return this.bodyCompositionService.create(currentUser, input);
  }

  @Mutation(() => BodyCompositionModel)
  async updateBodyComposition(
    @Args('id', { type: () => ID }) id: string,
    @Args('input') input: UpdateBodyCompositionInput,
  ) {
    const currentUser = await this.demoContext.getCurrentUser();
    return this.bodyCompositionService.update(currentUser, id, input);
  }

  @Mutation(() => BodyCompositionModel)
  async deleteBodyComposition(@Args('id', { type: () => ID }) id: string) {
    const currentUser = await this.demoContext.getCurrentUser();
    return this.bodyCompositionService.delete(currentUser, id);
  }
}
