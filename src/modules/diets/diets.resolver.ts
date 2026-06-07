import { Args, ID, Mutation, Query, Resolver } from '@nestjs/graphql';
import { AuthContextService } from '../auth/auth-context.service';
import { CreateDietInput } from './dto/create-diet.input';
import { DietModel } from './models/diet.model';
import { DietsService } from './diets.service';

@Resolver(() => DietModel)
export class DietsResolver {
  constructor(
    private readonly authContext: AuthContextService,
    private readonly dietsService: DietsService,
  ) {}

  @Query(() => DietModel, { nullable: true })
  async myActiveDiet(@Args('patientId', { type: () => ID }) patientId: string) {
    const currentUser = await this.authContext.getCurrentUser();
    return this.dietsService.activeDietByPatient(currentUser, patientId);
  }

  @Query(() => [DietModel])
  async dietsByPatient(
    @Args('patientId', { type: () => ID }) patientId: string,
  ) {
    const currentUser = await this.authContext.getCurrentUser();
    return this.dietsService.dietsByPatient(currentUser, patientId);
  }

  @Query(() => DietModel)
  async dietById(@Args('id', { type: () => ID }) id: string) {
    const currentUser = await this.authContext.getCurrentUser();
    return this.dietsService.dietById(currentUser, id);
  }

  @Mutation(() => DietModel)
  async createDiet(@Args('input') input: CreateDietInput) {
    const currentUser = await this.authContext.getCurrentUser();
    return this.dietsService.create(currentUser, input);
  }

  @Mutation(() => DietModel)
  async deactivateDiet(@Args('id', { type: () => ID }) id: string) {
    const currentUser = await this.authContext.getCurrentUser();
    return this.dietsService.deactivate(currentUser, id);
  }
}
