import { Module } from '@nestjs/common';
import { AuthModule } from '../auth/auth.module';
import { PrismaModule } from '../../prisma/prisma.module';
import { BodyMeasurementsResolver } from './body-measurements.resolver';
import { BodyMeasurementsService } from './body-measurements.service';

@Module({
  imports: [PrismaModule, AuthModule],
  providers: [BodyMeasurementsResolver, BodyMeasurementsService],
  exports: [BodyMeasurementsService],
})
export class BodyMeasurementsModule {}
