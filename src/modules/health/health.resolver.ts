import { Query, Resolver } from '@nestjs/graphql';

@Resolver()
export class HealthResolver {
  @Query(() => String, { description: 'Verifica que el servicio core esté activo' })
  health(): string {
    return 'VitalBite Core API is running';
  }
}
