import { Module } from '@nestjs/common';
import { DemoContextModule } from '../demo-context/demo-context.module';
import { PrismaModule } from '../../prisma/prisma.module';
import { AppointmentsResolver } from './appointments.resolver';
import { AppointmentsService } from './appointments.service';

@Module({
  imports: [PrismaModule, DemoContextModule],
  providers: [AppointmentsResolver, AppointmentsService],
  exports: [AppointmentsService],
})
export class AppointmentsModule {}
