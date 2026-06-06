import { Module } from '@nestjs/common';
import { PrismaModule } from '../../prisma/prisma.module';
import { AuthModule } from '../auth/auth.module';
import { AnthropometryResolver } from './anthropometry.resolver';
import { AnthropometryService } from './anthropometry.service';

@Module({
  imports: [PrismaModule, AuthModule],
  providers: [AnthropometryResolver, AnthropometryService],
  exports: [AnthropometryService],
})
export class AnthropometryModule {}
