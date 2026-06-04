import { Module } from '@nestjs/common';
import { DemoContextModule } from '../demo-context/demo-context.module';
import { PrismaModule } from '../../prisma/prisma.module';
import { PatientsResolver } from './patients.resolver';
import { PatientsService } from './patients.service';

@Module({
  imports: [PrismaModule, DemoContextModule],
  providers: [PatientsResolver, PatientsService],
  exports: [PatientsService],
})
export class PatientsModule {}
