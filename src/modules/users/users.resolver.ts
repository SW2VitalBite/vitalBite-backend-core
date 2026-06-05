import { Query, Resolver } from '@nestjs/graphql';
import { AuthContextService } from '../auth/auth-context.service';
import { UserModel } from './models/user.model';

@Resolver(() => UserModel)
export class UsersResolver {
  constructor(private readonly authContext: AuthContextService) {}

  @Query(() => UserModel)
  async me() {
    return this.authContext.getCurrentUser();
  }
}
