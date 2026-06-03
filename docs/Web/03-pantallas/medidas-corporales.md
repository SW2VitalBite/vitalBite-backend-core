# Pantalla de medidas corporales

## Ruta

- `/body-measurements`

## Actor principal

- Nutricionista.

## Objetivo

Registrar, consultar y comparar la evolución corporal del paciente.

## Layout sugerido

- Header con selector de paciente y botón `Nueva medición`.
- Panel de resumen con última medición.
- Gráficos de evolución.
- Tabla histórica de mediciones.
- Formulario lateral o modal de registro.

## Secciones visibles

- Selector/buscador de paciente.
- Último peso, IMC, cintura, cadera y fecha.
- Composición corporal reciente.
- Gráficos de peso, IMC, grasa y masa muscular.
- Historial de mediciones.

## Tabla y columnas

- Fecha.
- Peso.
- Talla.
- IMC.
- Cintura.
- Cadera.
- Grasa corporal.
- Masa muscular.
- Agua corporal.
- Acciones.

## Formulario de medición básica

Campos:

- Paciente.
- Fecha de medición.
- Peso en kg.
- Talla en cm.
- Cintura en cm.
- Cadera en cm.

## Formulario de composición corporal

Campos:

- Porcentaje de grasa.
- Masa muscular en kg.
- Agua corporal.
- Grasa visceral.
- Masa ósea.
- Edad metabólica.

Validaciones:

- Peso obligatorio.
- Fecha obligatoria.
- Valores numéricos no negativos.
- Talla requerida si se desea calcular IMC.

## Acciones principales

- Registrar medición.
- Editar medición.
- Registrar composición corporal.
- Ver historial.
- Comparar evolución.
- Ir a antropometría avanzada.

## Estados UI

- Cargando mediciones.
- Paciente sin mediciones.
- Error al cargar historial.
- Medición guardada.
- Sin permisos para editar.

## Permisos

- Nutricionista: registra y edita medidas de pacientes asignados.
- Administrador: consulta datos del tenant según permisos.
- Paciente: no accede a la Web.

## GraphQL

- `bodyMeasurementsByPatient(patientId)`.
- `bodyMeasurementById(id)`.
- `bodyCompositionByPatient(patientId)`.
- `latestBodyComposition(patientId)`.
- `createBodyMeasurement(input)`.
- `updateBodyMeasurement(id, input)`.
- `deleteBodyMeasurement(id)`.
- `createBodyComposition(input)`.
- `updateBodyComposition(id, input)`.

## Criterios para wireframe

- La primera vista debe pedir o mostrar un paciente seleccionado.
- Los gráficos deben estar encima del historial.
- El formulario debe separar medición básica y composición corporal.
- El historial debe permitir comparar fechas.
