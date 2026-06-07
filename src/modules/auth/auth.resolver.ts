import { Mutation, Resolver, Args } from '@nestjs/graphql';
import { AuthService } from './auth.service';
import { LoginInput } from './dto/login.input';
import { RegisterInput } from './dto/register.input';
import { JoinTenantInput } from './dto/join-tenant.input';
import { AuthSessionModel } from './models/auth-session.model';

@Resolver()
export class AuthResolver {
  constructor(private readonly authService: AuthService) {}

  @Mutation(() => AuthSessionModel)
  async login(@Args('input') input: LoginInput) {
    return this.authService.login(input);
  }

  @Mutation(() => AuthSessionModel)
  async register(@Args('input') input: RegisterInput) {
    return this.authService.register(input);
  }

  @Mutation(() => AuthSessionModel)
  async joinTenant(@Args('input') input: JoinTenantInput) {
    return this.authService.joinTenant(input);
  }
}
