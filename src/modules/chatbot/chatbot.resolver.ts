import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { ChatbotService } from './chatbot.service';
import { ChatbotValidationResponseModel } from './models/chatbot-validation.model';
import { CreatePendingAppointmentInput } from './dto/create-pending-appointment.input';
import { AppointmentModel } from '../appointments/models/appointment.model';

@Resolver()
export class ChatbotResolver {
  constructor(private readonly chatbotService: ChatbotService) {}

  @Query(() => ChatbotValidationResponseModel)
  async validatePatientByPhone(@Args('phone') phone: string) {
    return this.chatbotService.validatePatientByPhone(phone);
  }

  @Mutation(() => AppointmentModel)
  async createPendingAppointment(
    @Args('input') input: CreatePendingAppointmentInput,
  ) {
    return this.chatbotService.createPendingAppointment(input);
  }
}

