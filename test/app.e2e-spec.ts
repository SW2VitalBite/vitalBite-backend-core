/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-return */
import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import request from 'supertest';
import { App } from 'supertest/types';
import { AppModule } from './../src/app.module';

const describeWithDatabase = process.env.DATABASE_URL
  ? describe
  : describe.skip;

describeWithDatabase('AppModule (e2e)', () => {
  let app: INestApplication<App>;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  afterEach(async () => {
    await app.close();
  });

  it('/graphql (POST) health query', () => {
    return request(app.getHttpServer())
      .post('/graphql')
      .send({
        query: '{ health }',
      })
      .expect(200)
      .expect((res) => {
        expect(res.body.data.health).toBe('VitalBite Core API is running');
      });
  });

  it('/graphql (POST) patients query', () => {
    return request(app.getHttpServer())
      .post('/graphql')
      .send({
        query: `
          query {
            patients {
              fullName
              status
              nutritionGoal
            }
          }
        `,
      })
      .expect(200)
      .expect((res) => {
        expect(res.body.data.patients.length).toBeGreaterThanOrEqual(5);
        expect(
          res.body.data.patients.map((patient) => patient.fullName),
        ).toContain('Ana Rojas');
      });
  });

  it('/graphql (POST) create, update and archive patient', async () => {
    const createResponse = await request(app.getHttpServer())
      .post('/graphql')
      .send({
        query: `
          mutation CreatePatient($input: CreatePatientInput!) {
            createPatient(input: $input) {
              id
              tenantId
              fullName
              status
            }
          }
        `,
        variables: {
          input: {
            firstName: 'Maria',
            lastName: 'Rodriguez',
            email: `maria.rodriguez.${Date.now()}@email.com`,
            phone: '70067890',
            nutritionGoal: 'Reducir grasa corporal',
          },
        },
      })
      .expect(200);

    const patientId = createResponse.body.data.createPatient.id;
    expect(createResponse.body.data.createPatient.fullName).toBe(
      'Maria Rodriguez',
    );

    await request(app.getHttpServer())
      .post('/graphql')
      .send({
        query: `
          mutation UpdatePatient($id: ID!, $input: UpdatePatientInput!) {
            updatePatient(id: $id, input: $input) {
              id
              nutritionGoal
            }
          }
        `,
        variables: {
          id: patientId,
          input: {
            nutritionGoal: 'Control glucosa',
          },
        },
      })
      .expect(200)
      .expect((res) => {
        expect(res.body.data.updatePatient.nutritionGoal).toBe(
          'Control glucosa',
        );
      });

    await request(app.getHttpServer())
      .post('/graphql')
      .send({
        query: `
          mutation ArchivePatient($id: ID!) {
            archivePatient(id: $id) {
              id
              status
            }
          }
        `,
        variables: {
          id: patientId,
        },
      })
      .expect(200)
      .expect((res) => {
        expect(res.body.data.archivePatient.status).toBe('ARCHIVED');
      });
  });

  it('/graphql (POST) appointments query returns demo seed', () => {
    return request(app.getHttpServer())
      .post('/graphql')
      .send({
        query: `
          query {
            appointments {
              patientFullName
              nutritionistFullName
              status
              mode
              reason
            }
          }
        `,
      })
      .expect(200)
      .expect((res) => {
        expect(res.body.data.appointments.length).toBeGreaterThanOrEqual(5);
        expect(
          res.body.data.appointments.map(
            (appointment) => appointment.patientFullName,
          ),
        ).toContain('Luis Pinto');
      });
  });

  it('/graphql (POST) appointmentsByPatient query', async () => {
    const patientsResponse = await request(app.getHttpServer())
      .post('/graphql')
      .send({
        query: `
          query {
            patients(filter: { search: "Ana" }) {
              id
              fullName
            }
          }
        `,
      })
      .expect(200);

    const patientId = patientsResponse.body.data.patients[0].id;

    await request(app.getHttpServer())
      .post('/graphql')
      .send({
        query: `
          query AppointmentsByPatient($patientId: ID!) {
            appointmentsByPatient(patientId: $patientId) {
              patientId
              patientFullName
              status
            }
          }
        `,
        variables: {
          patientId,
        },
      })
      .expect(200)
      .expect((res) => {
        expect(res.body.data.appointmentsByPatient.length).toBeGreaterThan(0);
        expect(res.body.data.appointmentsByPatient[0].patientId).toBe(
          patientId,
        );
      });
  });

  it('/graphql (POST) create, reschedule and cancel appointment', async () => {
    const contextResponse = await request(app.getHttpServer())
      .post('/graphql')
      .send({
        query: `
          query {
            me {
              id
            }
            patients(filter: { search: "Luis" }) {
              id
            }
          }
        `,
      })
      .expect(200);

    const nutritionistId = contextResponse.body.data.me.id;
    const patientId = contextResponse.body.data.patients[0].id;
    const scheduledAt = new Date(Date.now() + 55 * 24 * 60 * 60 * 1000);
    const rescheduledAt = new Date(scheduledAt.getTime() + 2 * 60 * 60 * 1000);

    const createResponse = await request(app.getHttpServer())
      .post('/graphql')
      .send({
        query: `
          mutation CreateAppointment($input: CreateAppointmentInput!) {
            createAppointment(input: $input) {
              id
              tenantId
              patientId
              nutritionistId
              status
              mode
            }
          }
        `,
        variables: {
          input: {
            patientId,
            nutritionistId,
            scheduledAt: scheduledAt.toISOString(),
            durationMinutes: 30,
            mode: 'VIRTUAL',
            reason: 'Seguimiento e2e',
          },
        },
      })
      .expect(200);

    const appointmentId = createResponse.body.data.createAppointment.id;
    expect(createResponse.body.data.createAppointment.status).toBe('SCHEDULED');

    await request(app.getHttpServer())
      .post('/graphql')
      .send({
        query: `
          mutation RescheduleAppointment(
            $id: ID!
            $input: RescheduleAppointmentInput!
          ) {
            rescheduleAppointment(id: $id, input: $input) {
              id
              status
              scheduledAt
            }
          }
        `,
        variables: {
          id: appointmentId,
          input: {
            scheduledAt: rescheduledAt.toISOString(),
            durationMinutes: 30,
            reason: 'Cambio de horario e2e',
          },
        },
      })
      .expect(200)
      .expect((res) => {
        expect(res.body.data.rescheduleAppointment.status).toBe('RESCHEDULED');
      });

    await request(app.getHttpServer())
      .post('/graphql')
      .send({
        query: `
          mutation CancelAppointment($id: ID!, $input: CancelAppointmentInput!) {
            cancelAppointment(id: $id, input: $input) {
              id
              status
              cancelReason
            }
          }
        `,
        variables: {
          id: appointmentId,
          input: {
            reason: 'Cancelacion e2e',
          },
        },
      })
      .expect(200)
      .expect((res) => {
        expect(res.body.data.cancelAppointment.status).toBe('CANCELLED');
        expect(res.body.data.cancelAppointment.cancelReason).toBe(
          'Cancelacion e2e',
        );
      });
  });

  it('/graphql (POST) bodyMeasurementsByPatient returns demo seed', async () => {
    const patientsResponse = await request(app.getHttpServer())
      .post('/graphql')
      .send({
        query: `
          query {
            patients(filter: { search: "Ana" }) {
              id
            }
          }
        `,
      })
      .expect(200);

    const patientId = patientsResponse.body.data.patients[0].id;

    await request(app.getHttpServer())
      .post('/graphql')
      .send({
        query: `
          query BodyMeasurementsByPatient($patientId: ID!) {
            bodyMeasurementsByPatient(patientId: $patientId) {
              patientId
              weightKg
              heightCm
              bmi
            }
          }
        `,
        variables: {
          patientId,
        },
      })
      .expect(200)
      .expect((res) => {
        expect(res.body.data.bodyMeasurementsByPatient.length).toBeGreaterThan(
          0,
        );
        expect(res.body.data.bodyMeasurementsByPatient[0].patientId).toBe(
          patientId,
        );
      });
  });

  it('/graphql (POST) create, update and delete body measurement', async () => {
    const patientsResponse = await request(app.getHttpServer())
      .post('/graphql')
      .send({
        query: `
          query {
            patients(filter: { search: "Luis" }) {
              id
            }
          }
        `,
      })
      .expect(200);

    const patientId = patientsResponse.body.data.patients[0].id;
    const measuredAt = new Date(Date.now() - 2 * 24 * 60 * 60 * 1000);

    const createResponse = await request(app.getHttpServer())
      .post('/graphql')
      .send({
        query: `
          mutation CreateBodyMeasurement($input: CreateBodyMeasurementInput!) {
            createBodyMeasurement(input: $input) {
              id
              patientId
              weightKg
              heightCm
              bmi
            }
          }
        `,
        variables: {
          input: {
            patientId,
            measuredAt: measuredAt.toISOString(),
            weightKg: 70,
            heightCm: 170,
            waistCm: 82,
            hipCm: 98,
          },
        },
      })
      .expect(200);

    const bodyMeasurementId = createResponse.body.data.createBodyMeasurement.id;
    expect(createResponse.body.data.createBodyMeasurement.bmi).toBeCloseTo(
      24.22,
      2,
    );

    await request(app.getHttpServer())
      .post('/graphql')
      .send({
        query: `
          mutation UpdateBodyMeasurement(
            $id: ID!
            $input: UpdateBodyMeasurementInput!
          ) {
            updateBodyMeasurement(id: $id, input: $input) {
              id
              weightKg
              bmi
            }
          }
        `,
        variables: {
          id: bodyMeasurementId,
          input: {
            weightKg: 68,
          },
        },
      })
      .expect(200)
      .expect((res) => {
        expect(res.body.data.updateBodyMeasurement.bmi).toBeCloseTo(23.53, 2);
      });

    await request(app.getHttpServer())
      .post('/graphql')
      .send({
        query: `
          mutation DeleteBodyMeasurement($id: ID!) {
            deleteBodyMeasurement(id: $id) {
              id
            }
          }
        `,
        variables: {
          id: bodyMeasurementId,
        },
      })
      .expect(200)
      .expect((res) => {
        expect(res.body.data.deleteBodyMeasurement.id).toBe(bodyMeasurementId);
      });
  });

  it('/graphql (POST) create body composition and latest query', async () => {
    const patientsResponse = await request(app.getHttpServer())
      .post('/graphql')
      .send({
        query: `
          query {
            patients(filter: { search: "Marta" }) {
              id
            }
          }
        `,
      })
      .expect(200);

    const patientId = patientsResponse.body.data.patients[0].id;
    const measuredAt = new Date(Date.now() - 24 * 60 * 60 * 1000);

    const measurementResponse = await request(app.getHttpServer())
      .post('/graphql')
      .send({
        query: `
          mutation CreateBodyMeasurement($input: CreateBodyMeasurementInput!) {
            createBodyMeasurement(input: $input) {
              id
            }
          }
        `,
        variables: {
          input: {
            patientId,
            measuredAt: measuredAt.toISOString(),
            weightKg: 76,
            heightCm: 160,
          },
        },
      })
      .expect(200);

    const bodyMeasurementId =
      measurementResponse.body.data.createBodyMeasurement.id;

    await request(app.getHttpServer())
      .post('/graphql')
      .send({
        query: `
          mutation CreateBodyComposition($input: CreateBodyCompositionInput!) {
            createBodyComposition(input: $input) {
              id
              patientId
              bodyMeasurementId
              bodyFatPercentage
            }
          }
        `,
        variables: {
          input: {
            patientId,
            bodyMeasurementId,
            measuredAt: measuredAt.toISOString(),
            bodyFatPercentage: 34,
            muscleMassKg: 43,
            waterPercentage: 49,
          },
        },
      })
      .expect(200)
      .expect((res) => {
        expect(res.body.data.createBodyComposition.patientId).toBe(patientId);
        expect(res.body.data.createBodyComposition.bodyMeasurementId).toBe(
          bodyMeasurementId,
        );
      });

    await request(app.getHttpServer())
      .post('/graphql')
      .send({
        query: `
          query LatestBodyComposition($patientId: ID!) {
            latestBodyComposition(patientId: $patientId) {
              patientId
              bodyFatPercentage
            }
          }
        `,
        variables: {
          patientId,
        },
      })
      .expect(200)
      .expect((res) => {
        expect(res.body.data.latestBodyComposition.patientId).toBe(patientId);
      });
  });
});
