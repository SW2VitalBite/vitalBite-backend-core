import { Module } from '@nestjs/common';
import { DemoContextModule } from '../demo-context/demo-context.module';
import { UsersResolver } from './users.resolver';

@Module({
  imports: [DemoContextModule],
  providers: [UsersResolver],
})
export class UsersModule {}
