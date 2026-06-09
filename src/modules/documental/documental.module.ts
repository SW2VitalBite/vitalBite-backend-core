import { Module } from '@nestjs/common';
import { AuthModule } from '../auth/auth.module';
import { DietsModule } from '../diets/diets.module';
import { DocumentalIntegrationService } from './documental-integration.service';
import { DocumentalResolver } from './documental.resolver';

@Module({
  imports: [AuthModule, DietsModule],
  providers: [DocumentalResolver, DocumentalIntegrationService],
  exports: [DocumentalIntegrationService],
})
export class DocumentalModule {}
