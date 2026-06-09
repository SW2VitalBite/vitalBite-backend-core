import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { GraphQLModule } from '@nestjs/graphql';
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { Request } from 'express';
import { join } from 'path';
import './common/graphql/register-enums';
import { createGraphqlLoggingPlugin } from './common/graphql/graphql-logging.plugin';
import appConfig from './config/app.config';
import { AuthModule } from './modules/auth/auth.module';
import { HealthModule } from './modules/health/health.module';
import { TenantsModule } from './modules/tenants/tenants.module';
import { UsersModule } from './modules/users/users.module';
import { PatientsModule } from './modules/patients/patients.module';
import { AppointmentsModule } from './modules/appointments/appointments.module';
import { BodyMeasurementsModule } from './modules/body-measurements/body-measurements.module';
import { DietsModule } from './modules/diets/diets.module';
import { BodyCompositionModule } from './modules/body-composition/body-composition.module';
import { AnthropometryModule } from './modules/anthropometry/anthropometry.module';
import { ReportsModule } from './modules/reports/reports.module';
import { DocumentalModule } from './modules/documental/documental.module';
import { PaymentsModule } from './modules/payments/payments.module';
import { NotificationsModule } from './modules/notifications/notifications.module';
import { AuditModule } from './modules/audit/audit.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [appConfig],
    }),
    GraphQLModule.forRootAsync<ApolloDriverConfig>({
      driver: ApolloDriver,
      useFactory: () => ({
        autoSchemaFile: join(process.cwd(), 'src/schema.gql'),
        sortSchema: true,
        playground: false,
        graphiql: process.env.GRAPHQL_PLAYGROUND === 'true',
        plugins: [
          createGraphqlLoggingPlugin(
            process.env.GRAPHQL_LOG_RESPONSES !== 'false',
          ),
        ],
      }),
    }),
    AuthModule,
    HealthModule,
    TenantsModule,
    UsersModule,
    PatientsModule,
    AppointmentsModule,
    BodyMeasurementsModule,
    DietsModule,
    BodyCompositionModule,
    AnthropometryModule,
    ReportsModule,
    DocumentalModule,
    PaymentsModule,
    NotificationsModule,
    AuditModule,
  ],
})
export class AppModule {}
