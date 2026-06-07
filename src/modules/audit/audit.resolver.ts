import { Args, Query, Resolver } from '@nestjs/graphql';
import { AuthContextService } from '../auth/auth-context.service';
import { AuditService } from './audit.service';
import { AuditEventsFilterInput } from './dto/audit-events-filter.input';
import { AuditEventModel } from './models/audit-event.model';

@Resolver(() => AuditEventModel)
export class AuditResolver {
  constructor(
    private readonly authContext: AuthContextService,
    private readonly auditService: AuditService,
  ) {}

  @Query(() => [AuditEventModel])
  async auditEvents(
    @Args('filter', { nullable: true }) filter?: AuditEventsFilterInput,
  ) {
    const currentUser = await this.authContext.getCurrentUser();
    return this.auditService.findEvents(currentUser, filter ?? {});
  }

  @Query(() => AuditEventModel)
  async auditEventById(@Args('id') id: string) {
    const currentUser = await this.authContext.getCurrentUser();
    return this.auditService.findEventById(currentUser, id);
  }
}
