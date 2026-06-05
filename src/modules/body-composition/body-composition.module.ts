import { Module } from '@nestjs/common';
import { AuthModule } from '../auth/auth.module';
import { PrismaModule } from '../../prisma/prisma.module';
import { BodyCompositionResolver } from './body-composition.resolver';
import { BodyCompositionService } from './body-composition.service';

@Module({
  imports: [PrismaModule, AuthModule],
  providers: [BodyCompositionResolver, BodyCompositionService],
  exports: [BodyCompositionService],
})
export class BodyCompositionModule {}
