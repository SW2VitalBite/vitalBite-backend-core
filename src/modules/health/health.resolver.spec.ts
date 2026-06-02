import { HealthResolver } from './health.resolver';

describe('HealthResolver', () => {
  let resolver: HealthResolver;

  beforeEach(() => {
    resolver = new HealthResolver();
  });

  it('should return health message', () => {
    expect(resolver.health()).toBe('VitalBite Core API is running');
  });
});
