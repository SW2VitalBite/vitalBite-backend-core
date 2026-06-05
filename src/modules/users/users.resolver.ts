import { Query, Resolver } from '@nestjs/graphql';
import { DemoContextService } from '../demo-context/demo-context.service';
import { UserModel } from './models/user.model';

@Resolver(() => UserModel)
export class UsersResolver {
  constructor(private readonly demoContext: DemoContextService) {}

  @Query(() => UserModel)
  async me() {
    return this.demoContext.getCurrentUser();
  }
}
