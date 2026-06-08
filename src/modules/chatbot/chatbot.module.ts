import { Module } from '@nestjs/common';
import { ChatbotResolver } from './chatbot.resolver';
import { ChatbotService } from './chatbot.service';
import { PrismaModule } from '../../prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  providers: [ChatbotResolver, ChatbotService]
})
export class ChatbotModule {}
