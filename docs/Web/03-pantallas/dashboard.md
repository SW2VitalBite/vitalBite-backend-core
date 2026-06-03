# Pantalla de dashboard

## Ruta

- `/dashboard`

## Actor principal

- Administrador.
- Nutricionista.

## Objetivo

Mostrar un resumen operativo, nutricional y BI del tenant para tomar decisiones rápidas al iniciar sesión.

## Layout sugerido

- Header con título `Dashboard`, descripción breve y filtro de rango de fechas.
- Fila superior de KPIs principales.
- Bloque de agenda y citas.
- Bloque de pacientes y evolución nutricional.
- Bloque de adherencia, dietocálculo y seguimiento diario.
- Bloque IA/ML con riesgo nutricional y segmentación.
- Bloque financiero visible solo para administrador.

## Secciones visibles

- Resumen general del tenant o de pacientes asignados.
- Indicadores de pacientes.
- Indicadores de citas.
- Indicadores de dietas y adherencia.
- Indicadores de medidas corporales.
- Indicadores de riesgo nutricional.
- Segmentación de pacientes.
- Estado financiero o suscripción según permisos.
- Alertas operativas.

## KPIs principales

- Pacientes activos.
- Citas de hoy.
- Citas completadas.
- Citas canceladas.
- Cumplimiento promedio de dietas.
- Adherencia diaria promedio.
- Pacientes en riesgo.
- Dietas activas.
- Reportes generados.
- Ingresos por suscripción, solo administrador.

## Gráficos esperados

- Citas por estado.
- Evolución promedio de peso.
- Evolución promedio de IMC.
- Cumplimiento de dietas.
- Adherencia diaria.
- Riesgo nutricional por paciente o grupo.
- Segmentación K-means.
- Evolución antropométrica.
- Ingresos por suscripción, solo administrador.

## Filtros

- Rango de fechas.
- Nutricionista.
- Estado del paciente.
- Objetivo nutricional.
- Estado de cita.
- Estado de dieta.

## Tabla o lista de alertas

Columnas sugeridas:

- Fecha.
- Tipo de alerta.
- Paciente.
- Módulo relacionado.
- Prioridad.
- Estado.
- Acción.

Alertas posibles:

- Paciente con bajo cumplimiento.
- Paciente sin seguimiento reciente.
- Cita pendiente de confirmar.
- Dieta próxima a vencer.
- Riesgo nutricional alto.
- Límite de suscripción próximo, solo administrador.

## Acciones principales

- Filtrar dashboard.
- Ir a pacientes.
- Ir a citas del día.
- Ir a pacientes en riesgo.
- Ir a seguimiento nutricional.
- Ir a dietas activas.
- Ir a pagos y suscripciones, solo administrador.

## Estados UI

- Cargando indicadores.
- Sin datos para el rango seleccionado.
- Error al cargar dashboard.
- Sin permisos para indicadores financieros.
- Indicadores actualizados.

## Permisos

- Administrador: ve indicadores globales del tenant, financieros y administrativos.
- Nutricionista: ve indicadores de pacientes asignados, citas propias, dietas, medidas y seguimiento.
- Paciente: no accede a la Web.

## GraphQL

- `dashboardSummary(filter)`.
- `patientProgressDashboard(patientId)`.

## Reglas

- El dashboard debe cargar después del login.
- Los indicadores financieros solo se muestran con permisos administrativos.
- Los resultados de IA/ML se muestran como indicadores consultados desde el Core.
- La Web no calcula BI; solo presenta datos servidos por GraphQL.

## Criterios para wireframe

- Los KPIs deben ocupar la primera fila del contenido.
- Los gráficos deben estar en la zona central.
- Las alertas deben ser visibles sin desplazamiento excesivo.
- El filtro de fechas debe estar en el header.
- La sección financiera debe estar separada visualmente y ocultarse si el usuario no tiene permiso.
- El nutricionista debe ver un dashboard operativo, no financiero.
