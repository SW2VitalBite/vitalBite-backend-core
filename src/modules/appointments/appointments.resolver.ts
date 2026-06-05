import { Args, ID, Mutation, Query, Resolver } from '@nestjs/graphql';
import { AuthContextService } from '../auth/auth-context.service';
import { AppointmentsService } from './appointments.service';
import { AppointmentFilterInput } from './dto/appointment-filter.input';
import { CancelAppointmentInput } from './dto/cancel-appointment.input';
import { CompleteAppointmentInput } from './dto/complete-appointment.input';
import { CreateAppointmentInput } from './dto/create-appointment.input';
import { RescheduleAppointmentInput } from './dto/reschedule-appointment.input';
import { AppointmentModel } from './models/appointment.model';

@Resolver(() => AppointmentModel)
export class AppointmentsResolver {
  constructor(
    private readonly authContext: AuthContextService,
    private readonly appointmentsService: AppointmentsService,
  ) {}

  @Query(() => [AppointmentModel])
  async appointments(
    @Args('filter', { nullable: true }) filter?: AppointmentFilterInput,
  ) {
    const currentUser = await this.authContext.getCurrentUser();
    return this.appointmentsService.findMany(currentUser, filter);
  }

  @Query(() => AppointmentModel)
  async appointmentById(@Args('id', { type: () => ID }) id: string) {
    const currentUser = await this.authContext.getCurrentUser();
    return this.appointmentsService.findById(currentUser, id);
  }

  @Query(() => [AppointmentModel])
  async appointmentsByPatient(
    @Args('patientId', { type: () => ID }) patientId: string,
  ) {
    const currentUser = await this.authContext.getCurrentUser();
    return this.appointmentsService.findByPatient(currentUser, patientId);
  }

  @Query(() => [AppointmentModel])
  async appointmentsCalendar(
    @Args('filter', { nullable: true }) filter?: AppointmentFilterInput,
  ) {
    const currentUser = await this.authContext.getCurrentUser();
    return this.appointmentsService.findCalendar(currentUser, filter);
  }

  @Mutation(() => AppointmentModel)
  async createAppointment(@Args('input') input: CreateAppointmentInput) {
    const currentUser = await this.authContext.getCurrentUser();
    return this.appointmentsService.create(currentUser, input);
  }

  @Mutation(() => AppointmentModel)
  async confirmAppointment(@Args('id', { type: () => ID }) id: string) {
    const currentUser = await this.authContext.getCurrentUser();
    return this.appointmentsService.confirm(currentUser, id);
  }

  @Mutation(() => AppointmentModel)
  async rescheduleAppointment(
    @Args('id', { type: () => ID }) id: string,
    @Args('input') input: RescheduleAppointmentInput,
  ) {
    const currentUser = await this.authContext.getCurrentUser();
    return this.appointmentsService.reschedule(currentUser, id, input);
  }

  @Mutation(() => AppointmentModel)
  async cancelAppointment(
    @Args('id', { type: () => ID }) id: string,
    @Args('input') input: CancelAppointmentInput,
  ) {
    const currentUser = await this.authContext.getCurrentUser();
    return this.appointmentsService.cancel(currentUser, id, input);
  }

  @Mutation(() => AppointmentModel)
  async completeAppointment(
    @Args('id', { type: () => ID }) id: string,
    @Args('input', { nullable: true }) input?: CompleteAppointmentInput,
  ) {
    const currentUser = await this.authContext.getCurrentUser();
    return this.appointmentsService.complete(currentUser, id, input);
  }

  @Mutation(() => AppointmentModel)
  async markAppointmentNoShow(@Args('id', { type: () => ID }) id: string) {
    const currentUser = await this.authContext.getCurrentUser();
    return this.appointmentsService.markNoShow(currentUser, id);
  }
}
