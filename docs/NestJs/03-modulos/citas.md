# Módulo de citas

## Objetivo

Administrar la agenda de consultas nutricionales.

## Actores

- Nutricionista.
- Paciente.

## Responsabilidades

- Agendar citas.
- Confirmar asistencia.
- Reprogramar citas.
- Cancelar citas.
- Consultar calendario.
- Registrar estado de atención.

## Datos principales

- Paciente.
- Nutricionista.
- Fecha y hora.
- Estado.
- Motivo.
- Observaciones.

## Operaciones GraphQL esperadas

- `appointments`
- `appointmentById`
- `createAppointment`
- `confirmAppointment`
- `rescheduleAppointment`
- `cancelAppointment`

## Estado implementado

El segundo slice funcional del Core ya implementa citas con PostgreSQL,
Prisma y GraphQL Code First.

Incluye:

- Modelo `Appointment` con relacion a tenant, paciente y nutricionista.
- Enums `AppointmentStatus` y `AppointmentMode`.
- Consultas `appointments`, `appointmentById`, `appointmentsByPatient` y `appointmentsCalendar`.
- Mutaciones `createAppointment`, `confirmAppointment`, `rescheduleAppointment`, `cancelAppointment`, `completeAppointment` y `markAppointmentNoShow`.
- Filtros por paciente, nutricionista, estado, rango de fechas y busqueda.
- Archivo logico al cancelar mediante `deletedAt`.
- Validacion de choque de horario para el mismo nutricionista en estados activos.
- Seed demo con Luis Pinto, Ana Rojas, Marta Silva, Carlos Meza y Sofia Arias.

No incluye todavia recordatorios, disponibilidad real, notificaciones, JWT,
roles completos ni automatizacion externa.
