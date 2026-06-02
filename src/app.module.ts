import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { GraphQLModule } from '@nestjs/graphql';
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { join } from 'path';
import appConfig from './config/app.config';
import { HealthModule } from './modules/health/health.module';
import { TenantsModule } from './modules/tenants/tenants.module';
import { PatientsModule } from './modules/patients/patients.module';
import { AppointmentsModule } from './modules/appointments/appointments.module';
import { BodyMeasurementsModule } from './modules/body-measurements/body-measurements.module';
import { DietsModule } from './modules/diets/diets.module';
import { BodyCompositionModule } from './modules/body-composition/body-composition.module';
import { ReportsModule } from './modules/reports/reports.module';

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
        playground: process.env.GRAPHQL_PLAYGROUND === 'true',
      }),
    }),
    HealthModule,
    TenantsModule,
    PatientsModule,
    AppointmentsModule,
    BodyMeasurementsModule,
    DietsModule,
    BodyCompositionModule,
    ReportsModule,
  ],
})
export class AppModule {}
