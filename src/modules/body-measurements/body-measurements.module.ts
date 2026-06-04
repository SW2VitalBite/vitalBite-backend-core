import { Module } from '@nestjs/common';
import { DemoContextModule } from '../demo-context/demo-context.module';
import { PrismaModule } from '../../prisma/prisma.module';
import { BodyMeasurementsResolver } from './body-measurements.resolver';
import { BodyMeasurementsService } from './body-measurements.service';

@Module({
  imports: [PrismaModule, DemoContextModule],
  providers: [BodyMeasurementsResolver, BodyMeasurementsService],
  exports: [BodyMeasurementsService],
})
export class BodyMeasurementsModule {}
