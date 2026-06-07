import { Module } from '@nestjs/common';
import { PrismaModule } from '../../prisma/prisma.module';
import { GraphQLJSON } from '../audit/graphql-json.scalar';
import { AuthModule } from '../auth/auth.module';
import { RiskPredictionsResolver } from './risk-predictions.resolver';
import { RiskPredictionsService } from './risk-predictions.service';

@Module({
  imports: [PrismaModule, AuthModule],
  providers: [
    RiskPredictionsResolver,
    RiskPredictionsService,
    {
      provide: 'GraphQLJSON',
      useValue: GraphQLJSON,
    },
  ],
  exports: [RiskPredictionsService],
})
export class RiskPredictionsModule {}
