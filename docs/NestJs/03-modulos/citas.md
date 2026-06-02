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
