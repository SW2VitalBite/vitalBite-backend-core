import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { PrismaModule } from '../../prisma/prisma.module';
import { AuthContextService } from './auth-context.service';
import { AuthResolver } from './auth.resolver';
import { AuthService } from './auth.service';

@Module({
  imports: [
    PrismaModule,
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => {
        const secret = configService.get<string>('jwtSecret');

        if (!secret) {
          throw new Error('JWT_SECRET is required to start authentication.');
        }

        const expiresIn = (configService.get<string>('jwtExpiresIn') ??
          '8h') as never;

        return {
          secret,
          signOptions: {
            expiresIn,
          },
        };
      },
    }),
  ],
  providers: [AuthResolver, AuthService, AuthContextService],
  exports: [AuthContextService, JwtModule],
})
export class AuthModule {}
