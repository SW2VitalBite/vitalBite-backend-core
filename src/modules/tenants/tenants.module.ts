import { Module } from '@nestjs/common';
import { AuthModule } from '../auth/auth.module';
import { TenantsResolver } from './tenants.resolver';

@Module({
  imports: [AuthModule],
  providers: [TenantsResolver],
})
export class TenantsModule {}
