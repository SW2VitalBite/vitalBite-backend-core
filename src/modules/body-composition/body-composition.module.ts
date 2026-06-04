import { Module } from '@nestjs/common';
import { DemoContextModule } from '../demo-context/demo-context.module';
import { PrismaModule } from '../../prisma/prisma.module';
import { BodyCompositionResolver } from './body-composition.resolver';
import { BodyCompositionService } from './body-composition.service';

@Module({
  imports: [PrismaModule, DemoContextModule],
  providers: [BodyCompositionResolver, BodyCompositionService],
  exports: [BodyCompositionService],
})
export class BodyCompositionModule {}
