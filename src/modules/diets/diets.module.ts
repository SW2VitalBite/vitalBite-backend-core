import { Module } from '@nestjs/common';
import { PrismaModule } from '../../prisma/prisma.module';
import { AuthModule } from '../auth/auth.module';
import { DietsResolver } from './diets.resolver';
import { DietsService } from './diets.service';

@Module({
  imports: [PrismaModule, AuthModule],
  providers: [DietsResolver, DietsService],
  exports: [DietsService],
})
export class DietsModule {}
