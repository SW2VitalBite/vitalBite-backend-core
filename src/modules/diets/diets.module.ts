import { Module } from '@nestjs/common';
import { PrismaModule } from '../../prisma/prisma.module';
import { AuthModule } from '../auth/auth.module';
import { NotificationsModule } from '../notifications/notifications.module';
import { DietsResolver } from './diets.resolver';
import { DietsService } from './diets.service';

@Module({
  imports: [PrismaModule, AuthModule, NotificationsModule],
  providers: [DietsResolver, DietsService],
  exports: [DietsService],
})
export class DietsModule {}
