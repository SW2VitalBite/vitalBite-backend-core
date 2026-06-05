import { Query, Resolver } from '@nestjs/graphql';
import { AuthContextService } from '../auth/auth-context.service';
import { TenantModel } from './models/tenant.model';

@Resolver(() => TenantModel)
export class TenantsResolver {
  constructor(private readonly authContext: AuthContextService) {}

  @Query(() => TenantModel)
  async currentTenant() {
    const currentUser = await this.authContext.getCurrentUser();
    return currentUser.tenant;
  }
}
