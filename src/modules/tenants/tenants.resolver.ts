import { Query, Resolver } from '@nestjs/graphql';
import { DemoContextService } from '../demo-context/demo-context.service';
import { TenantModel } from './models/tenant.model';

@Resolver(() => TenantModel)
export class TenantsResolver {
  constructor(private readonly demoContext: DemoContextService) {}

  @Query(() => TenantModel)
  async currentTenant() {
    const currentUser = await this.demoContext.getCurrentUser();
    return currentUser.tenant;
  }
}
