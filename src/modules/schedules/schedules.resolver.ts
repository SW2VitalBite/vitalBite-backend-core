import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { SchedulesService } from './schedules.service';
import { ScheduleModel } from './models/schedule.model';
import { SaveScheduleInput } from './dto/save-schedule.input';
import { UseGuards } from '@nestjs/common';
import { AuthContextService } from '../auth/auth-context.service';

@Resolver(() => ScheduleModel)
export class SchedulesResolver {
  constructor(
    private readonly schedulesService: SchedulesService,
    private readonly authContext: AuthContextService,
  ) {}

  @Query(() => [ScheduleModel])
  async mySchedules() {
    const currentUser = await this.authContext.getCurrentUser();
    return this.schedulesService.mySchedules(currentUser);
  }

  @Mutation(() => [ScheduleModel])
  async saveSchedules(
    @Args('inputs', { type: () => [SaveScheduleInput] }) inputs: SaveScheduleInput[]
  ) {
    const currentUser = await this.authContext.getCurrentUser();
    return this.schedulesService.saveSchedules(currentUser, inputs);
  }
}

