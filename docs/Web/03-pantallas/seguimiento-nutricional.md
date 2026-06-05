# Pantalla de seguimiento nutricional

## Ruta

- `/nutrition-tracking`

## Actor principal

- Nutricionista.

## Objetivo

Visualizar el progreso clínico y diario del paciente para tomar decisiones durante el seguimiento nutricional.

## Layout sugerido

- Header con selector de paciente y botón `Nuevo seguimiento`.
- Panel de resumen del progreso.
- Tabs: seguimiento clínico, seguimiento diario, fotos, actividad física, metas y alertas.
- Gráficos de adherencia y evolución.
- Tabla histórica de seguimientos.

## Secciones visibles

- Resumen de cumplimiento de dieta.
- Estado de progreso.
- Alertas abiertas.
- Observaciones del nutricionista.
- Seguimiento diario registrado desde móvil.
- Fotos de alimentos.
- Actividad física.
- Estado de ánimo.
- Metas del paciente.

## Tabla y columnas

- Fecha.
- Cumplimiento de dieta.
- Estado de progreso.
- Alertas.
- Observaciones.
- Registrado por.
- Acciones.

## Formulario de seguimiento clínico

Campos:

- Paciente.
- Fecha.
- Porcentaje de cumplimiento.
- Estado de progreso.
- Observaciones.
- Alertas.

## Vista de seguimiento diario

Campos visibles:

- Fecha.
- Dieta asociada.
- Adherencia.
- Ánimo.
- Notas del paciente.
- Fotos de alimentos.
- Actividades físicas.
- Metas relacionadas.

## Acciones principales

- Crear seguimiento clínico.
- Editar seguimiento.
- Ver detalle diario.
- Revisar fotos.
- Crear meta del paciente.
- Completar o cancelar meta.
- Ir a dieta activa.
- Ir a medidas corporales.

## Estados UI

- Cargando seguimiento.
- Sin registros clínicos.
- Sin registros diarios.
- Error al cargar progreso.
- Seguimiento guardado.
- Sin permisos para editar.

## Permisos

- Nutricionista: registra seguimiento clínico y consulta seguimiento diario de pacientes asignados.
- Administrador: consulta información del tenant según permisos.
- Paciente: registra seguimiento diario desde React Native, no desde Web.

## GraphQL

- `trackingByPatient(patientId)`.
- `trackingSummary(patientId)`.
- `dailyTrackingByPatient(patientId, filter)`.
- `patientGoals(patientId)`.
- `createTrackingEntry(input)`.
- `updateTrackingEntry(id, input)`.
- `createPatientGoal(input)`.
- `updatePatientGoal(id, input)`.
- `completePatientGoal(id)`.
- `cancelPatientGoal(id)`.

## Criterios para wireframe

- El resumen debe aparecer antes del historial.
- Los tabs deben separar seguimiento clínico y diario.
- Las fotos de alimentos deben mostrarse como galería o lista compacta.
- Las metas deben verse como checklist de estado.
