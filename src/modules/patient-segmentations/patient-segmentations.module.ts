import { Module } from '@nestjs/common';
import { PrismaModule } from '../../prisma/prisma.module';
import { AuthModule } from '../auth/auth.module';
import { PatientSegmentationsResolver } from './patient-segmentations.resolver';
import { PatientSegmentationsService } from './patient-segmentations.service';

@Module({
  imports: [PrismaModule, AuthModule],
  providers: [PatientSegmentationsService, PatientSegmentationsResolver],
  exports: [PatientSegmentationsService],
})
export class PatientSegmentationsModule {}

