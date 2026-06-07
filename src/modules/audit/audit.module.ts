import { Module } from '@nestjs/common';
import { PrismaModule } from '../../prisma/prisma.module';
import { AuthModule } from '../auth/auth.module';
import { GraphQLJSON } from './graphql-json.scalar';
import { AuditResolver } from './audit.resolver';
import { AuditService } from './audit.service';

@Module({
  imports: [AuthModule, PrismaModule],
  providers: [
    AuditResolver,
    AuditService,
    {
      provide: 'JSON',
      useValue: GraphQLJSON,
    },
  ],
  exports: [AuditService],
})
export class AuditModule {}
