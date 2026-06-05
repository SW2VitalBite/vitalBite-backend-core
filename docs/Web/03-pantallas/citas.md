# Pantalla de citas

## Ruta

- `/appointments`

## Actor principal

- Nutricionista.
- Administrador.

## Objetivo

Administrar la agenda nutricional, el calendario de consultas y los cambios de estado de citas.

## Layout sugerido

- Header con título `Citas`, rango de fechas y botón `Nueva cita`.
- Vista principal con calendario.
- Vista alternativa en tabla/lista.
- Panel lateral o modal para crear, reprogramar o cancelar cita.

## Secciones visibles

- Calendario diario, semanal o mensual.
- Filtros por nutricionista, paciente, estado y rango de fechas.
- Lista de próximas citas.
- Resumen de citas del día.
- Modales de confirmación para cambios críticos.

## Tabla y columnas

- Fecha y hora.
- Paciente.
- Nutricionista.
- Duración.
- Motivo.
- Estado.
- Acciones.

## Formulario de cita

Campos:

- Paciente.
- Nutricionista.
- Fecha.
- Hora.
- Duración en minutos.
- Motivo.
- Observaciones.

Validaciones:

- Paciente obligatorio.
- Nutricionista obligatorio.
- Fecha y hora obligatorias.
- Duración mayor a cero.
- No permitir fechas inválidas.

## Acciones principales

- Agendar cita.
- Confirmar cita.
- Reprogramar cita.
- Cancelar cita.
- Marcar como completada.
- Marcar inasistencia.
- Ver detalle del paciente.

## Estados UI

- Cargando calendario.
- Sin citas en el rango seleccionado.
- Error al cargar agenda.
- Cita guardada.
- Cambio de estado exitoso.
- Sin permisos para modificar.

## Permisos

- Administrador: consulta agenda del tenant.
- Nutricionista: gestiona su agenda y pacientes asignados.
- Paciente: no accede a la Web.

## GraphQL

- `appointments(filter)`.
- `appointmentById(id)`.
- `appointmentsByPatient(patientId)`.
- `appointmentsCalendar(filter)`.
- `createAppointment(input)`.
- `confirmAppointment(id)`.
- `rescheduleAppointment(id, input)`.
- `cancelAppointment(id, input)`.
- `completeAppointment(id, input)`.
- `markAppointmentNoShow(id)`.

## Criterios para wireframe

- El calendario debe ser el elemento visual dominante.
- Los estados deben distinguirse con etiquetas visuales.
- Reprogramar y cancelar deben abrir modal.
- El formulario debe permitir seleccionar paciente desde búsqueda.
- La vista lista debe servir para escaneo rápido y filtros.

## Backend disponible

El Core NestJS ya expone el contrato GraphQL necesario para esta pantalla.
La respuesta de `Appointment` incluye `patientFullName` y
`nutritionistFullName` para componer calendario, tabla y modal sin consultas
adicionales en el primer prototipo Angular.
