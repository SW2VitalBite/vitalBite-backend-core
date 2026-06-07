import { Args, ID, Mutation, Query, Resolver } from '@nestjs/graphql';
import { AuthContextService } from '../auth/auth-context.service';
import { DietPlanStatus } from '../../prisma/generated-client';
import { CreateDietPlanInput } from './dto/create-diet-plan.input';
import { DietFilterInput } from './dto/diet-filter.input';
import { DuplicateDietPlanDayInput } from './dto/duplicate-diet-plan-day.input';
import { UpdateDietPlanStructureInput } from './dto/update-diet-plan-structure.input';
import { UpdateDietPlanInput } from './dto/update-diet-plan.input';
import { DietsService } from './diets.service';
import { DietPlanModel } from './models/diet-plan.model';

@Resolver(() => DietPlanModel)
export class DietsResolver {
  constructor(
    private readonly authContext: AuthContextService,
    private readonly dietsService: DietsService,
  ) {}

  @Query(() => [DietPlanModel])
  async diets(@Args('filter', { nullable: true }) filter?: DietFilterInput) {
    const currentUser = await this.authContext.getCurrentUser();
    return this.dietsService.findMany(currentUser, filter);
  }

  @Query(() => [DietPlanModel])
  async dietsByPatient(@Args('patientId', { type: () => ID }) patientId: string) {
    const currentUser = await this.authContext.getCurrentUser();
    return this.dietsService.findByPatient(currentUser, patientId);
  }

  @Query(() => DietPlanModel)
  async dietById(@Args('id', { type: () => ID }) id: string) {
    const currentUser = await this.authContext.getCurrentUser();
    return this.dietsService.findById(currentUser, id);
  }

  @Query(() => DietPlanModel)
  async activeDietByPatient(@Args('patientId', { type: () => ID }) patientId: string) {
    const currentUser = await this.authContext.getCurrentUser();
    return this.dietsService.findActiveByPatient(currentUser, patientId);
  }

  @Mutation(() => DietPlanModel)
  async createDietPlan(@Args('input') input: CreateDietPlanInput) {
    const currentUser = await this.authContext.getCurrentUser();
    return this.dietsService.create(currentUser, input);
  }

  @Mutation(() => DietPlanModel)
  async updateDietPlan(
    @Args('id', { type: () => ID }) id: string,
    @Args('input') input: UpdateDietPlanInput,
  ) {
    const currentUser = await this.authContext.getCurrentUser();
    return this.dietsService.update(currentUser, id, input);
  }

  @Mutation(() => DietPlanModel)
  async updateDietPlanStructure(
    @Args('id', { type: () => ID }) id: string,
    @Args('input') input: UpdateDietPlanStructureInput,
  ) {
    const currentUser = await this.authContext.getCurrentUser();
    return this.dietsService.updateStructure(currentUser, id, input);
  }

  @Mutation(() => DietPlanModel)
  async changeDietPlanStatus(
    @Args('id', { type: () => ID }) id: string,
    @Args('status', { type: () => DietPlanStatus }) status: DietPlanStatus,
  ) {
    const currentUser = await this.authContext.getCurrentUser();
    return this.dietsService.changeStatus(currentUser, id, status);
  }

  @Mutation(() => DietPlanModel)
  async duplicateDietPlanDay(@Args('input') input: DuplicateDietPlanDayInput) {
    const currentUser = await this.authContext.getCurrentUser();
    return this.dietsService.duplicateDay(currentUser, input);
  }

  @Mutation(() => String)
  async generateDietPdf(@Args('id', { type: () => ID }) id: string) {
    const currentUser = await this.authContext.getCurrentUser();
    return this.dietsService.generatePdf(currentUser, id);
  }
}
