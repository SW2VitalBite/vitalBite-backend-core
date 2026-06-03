# Pantalla de dashboard

## Objetivo

Mostrar indicadores administrativos, BI y nutricionales del tenant.

## Actor principal

- Administrador.
- Nutricionista.

## Contenido

- Pacientes activos.
- Citas programadas, completadas y canceladas.
- Cumplimiento promedio de dietas.
- Evolución promedio de medidas.
- Riesgo nutricional.
- Segmentación K-means.
- Ingresos o estado financiero según permisos.
- Adherencia diaria y seguimiento del paciente.
- Indicadores derivados de dietocálculo.

## GraphQL

- `dashboardSummary(filter)`.
- `patientProgressDashboard(patientId)`.

## Reglas

- Administrador ve indicadores del tenant.
- Nutricionista ve indicadores asociados a sus pacientes.
- Indicadores financieros solo se muestran con permisos administrativos.
