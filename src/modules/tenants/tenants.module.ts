import { Module } from '@nestjs/common';
import { DemoContextModule } from '../demo-context/demo-context.module';
import { TenantsResolver } from './tenants.resolver';

@Module({
  imports: [DemoContextModule],
  providers: [TenantsResolver],
})
export class TenantsModule {}
