import {
  Args,
  ID,
  Mutation,
  Parent,
  Query,
  ResolveField,
  Resolver,
} from '@nestjs/graphql';
import { AuthContextService } from '../auth/auth-context.service';
import { CreatePatientInput } from './dto/create-patient.input';
import { PatientFilterInput } from './dto/patient-filter.input';
import { UpdatePatientInput } from './dto/update-patient.input';
import { PatientModel } from './models/patient.model';
import { PatientsService } from './patients.service';

@Resolver(() => PatientModel)
export class PatientsResolver {
  constructor(
    private readonly authContext: AuthContextService,
    private readonly patientsService: PatientsService,
  ) {}

  @Query(() => [PatientModel])
  async patients(
    @Args('filter', { nullable: true }) filter?: PatientFilterInput,
  ) {
    const currentUser = await this.authContext.getCurrentUser();
    return this.patientsService.findMany(currentUser, filter);
  }

  @Query(() => PatientModel)
  async patientById(@Args('id', { type: () => ID }) id: string) {
    const currentUser = await this.authContext.getCurrentUser();
    return this.patientsService.findById(currentUser, id);
  }

  @Query(() => [PatientModel])
  async patientsByNutritionist(
    @Args('nutritionistId', { type: () => ID }) nutritionistId: string,
  ) {
    const currentUser = await this.authContext.getCurrentUser();
    return this.patientsService.findByNutritionist(currentUser, nutritionistId);
  }

  @Mutation(() => PatientModel)
  async createPatient(@Args('input') input: CreatePatientInput) {
    const currentUser = await this.authContext.getCurrentUser();
    return this.patientsService.create(currentUser, input);
  }

  @Mutation(() => PatientModel)
  async updatePatient(
    @Args('id', { type: () => ID }) id: string,
    @Args('input') input: UpdatePatientInput,
  ) {
    const currentUser = await this.authContext.getCurrentUser();
    return this.patientsService.update(currentUser, id, input);
  }

  @Mutation(() => PatientModel)
  async archivePatient(@Args('id', { type: () => ID }) id: string) {
    const currentUser = await this.authContext.getCurrentUser();
    return this.patientsService.archive(currentUser, id);
  }

  @Mutation(() => PatientModel)
  async assignPatientToNutritionist(
    @Args('patientId', { type: () => ID }) patientId: string,
    @Args('nutritionistId', { type: () => ID }) nutritionistId: string,
  ) {
    const currentUser = await this.authContext.getCurrentUser();
    return this.patientsService.assignToNutritionist(
      currentUser,
      patientId,
      nutritionistId,
    );
  }

  @ResolveField(() => String)
  fullName(@Parent() patient: PatientModel) {
    return `${patient.firstName} ${patient.lastName}`;
  }
}
