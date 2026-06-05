import { Module } from '@nestjs/common';
import { AuthModule } from '../auth/auth.module';
import { PaymentsIntegrationService } from './payments-integration.service';
import { PaymentsResolver } from './payments.resolver';

@Module({
  imports: [AuthModule],
  providers: [PaymentsIntegrationService, PaymentsResolver],
})
export class PaymentsModule {}
