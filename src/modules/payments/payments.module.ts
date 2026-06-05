import { Module } from '@nestjs/common';
import { AuditModule } from '../audit/audit.module';
import { AuthModule } from '../auth/auth.module';
import { PaymentsIntegrationService } from './payments-integration.service';
import { PaymentsResolver } from './payments.resolver';

@Module({
  imports: [AuthModule, AuditModule],
  providers: [PaymentsIntegrationService, PaymentsResolver],
  exports: [PaymentsIntegrationService],
})
export class PaymentsModule {}
