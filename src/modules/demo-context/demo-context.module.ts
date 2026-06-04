import { Module } from '@nestjs/common';
import { PrismaModule } from '../../prisma/prisma.module';
import { DemoContextService } from './demo-context.service';

@Module({
  imports: [PrismaModule],
  providers: [DemoContextService],
  exports: [DemoContextService],
})
export class DemoContextModule {}
