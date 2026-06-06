import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { AuthContextService } from '../auth/auth-context.service';
import { CreateUserInput } from './dto/create-user.input';
import { UpdateUserInput } from './dto/update-user.input';
import { UserModel } from './models/user.model';
import { UsersService } from './users.service';

@Resolver(() => UserModel)
export class UsersResolver {
  constructor(
    private readonly authContext: AuthContextService,
    private readonly usersService: UsersService,
  ) {}

  @Query(() => UserModel)
  async me() {
    return this.authContext.getCurrentUser();
  }

  @Query(() => [UserModel])
  async users() {
    const currentUser = await this.authContext.getCurrentUser();
    return this.usersService.findTenantUsers(currentUser);
  }

  @Mutation(() => UserModel)
  async createUser(@Args('input') input: CreateUserInput) {
    const currentUser = await this.authContext.getCurrentUser();
    return this.usersService.createTenantUser(currentUser, input);
  }

  @Mutation(() => UserModel)
  async updateUser(@Args('input') input: UpdateUserInput) {
    const currentUser = await this.authContext.getCurrentUser();
    return this.usersService.updateTenantUser(currentUser, input);
  }

  @Mutation(() => UserModel)
  async disableUser(@Args('userId') userId: string) {
    const currentUser = await this.authContext.getCurrentUser();
    return this.usersService.disableTenantUser(currentUser, userId);
  }

  @Mutation(() => UserModel)
  async reactivateUser(@Args('userId') userId: string) {
    const currentUser = await this.authContext.getCurrentUser();
    return this.usersService.reactivateTenantUser(currentUser, userId);
  }
}
