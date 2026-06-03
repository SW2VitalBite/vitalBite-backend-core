# Pantalla de citas

## Objetivo

Administrar agenda nutricional y estado de consultas.

## Vistas

- Calendario.
- Lista de citas.
- Formulario de agendamiento.
- Modal de reprogramación o cancelación.

## Estados

- Programada.
- Confirmada.
- Completada.
- Cancelada.
- Reprogramada.
- No asistió.

## GraphQL

- `appointments(filter)`.
- `appointmentsCalendar(filter)`.
- `appointmentsByPatient(patientId)`.
- `createAppointment(input)`.
- `confirmAppointment(id)`.
- `rescheduleAppointment(id, input)`.
- `cancelAppointment(id, input)`.
- `completeAppointment(id, input)`.
- `markAppointmentNoShow(id)`.

## Reglas

- Nutricionista gestiona su agenda.
- Administrador puede ver calendario del tenant.
- Cambios importantes generan eventos auditables en el backend.
