import { Module } from '@nestjs/common';
import { AuthModule } from '../auth/auth.module';
import { PrismaModule } from '../../prisma/prisma.module';
import { PatientsResolver } from './patients.resolver';
import { PatientsService } from './patients.service';

@Module({
  imports: [PrismaModule, AuthModule],
  providers: [PatientsResolver, PatientsService],
  exports: [PatientsService],
})
export class PatientsModule {}
