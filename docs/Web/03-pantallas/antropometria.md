# Pantalla de antropometría avanzada

## Ruta

- `/anthropometry`

## Actor principal

- Nutricionista.

## Objetivo

Registrar pliegues, diámetros, perímetros avanzados, calcular somatotipo y visualizar somatocarta.

## Layout sugerido

- Header con selector de paciente y botón `Nueva antropometría`.
- Panel de última medición antropométrica.
- Formulario de medición.
- Resultado de somatotipo.
- Visualización de somatocarta.
- Historial de mediciones.

## Secciones visibles

- Datos del paciente.
- Medición corporal asociada.
- Pliegues.
- Diámetros.
- Perímetros.
- Resultado Heath-Carter.
- Coordenadas de somatocarta.

## Tabla y columnas

- Fecha.
- Pliegue tricipital.
- Pliegue subescapular.
- Pliegue suprailiaco.
- Pliegue pantorrilla.
- Endomorfia.
- Mesomorfia.
- Ectomorfia.
- Acciones.

## Formulario de antropometría

Campos:

- Paciente.
- Medición corporal asociada.
- Fecha.
- Pliegue tricipital en mm.
- Pliegue subescapular en mm.
- Pliegue suprailiaco en mm.
- Pliegue de pantorrilla en mm.
- Diámetro de húmero en cm.
- Diámetro de fémur en cm.
- Perímetro de brazo contraído en cm.
- Perímetro de pantorrilla en cm.

## Resultado de somatotipo

Campos visibles:

- Endomorfia.
- Mesomorfia.
- Ectomorfia.
- Coordenada X.
- Coordenada Y.
- Fecha de cálculo.

## Acciones principales

- Registrar antropometría.
- Calcular somatotipo.
- Ver somatocarta.
- Consultar historial.
- Ir a medidas corporales.

## Estados UI

- Cargando antropometría.
- Sin datos antropométricos.
- Faltan datos mínimos.
- Somatotipo calculado.
- Error de validación de unidades.
- Sin permisos para registrar.

## Permisos

- Nutricionista: registra antropometría de pacientes asignados.
- Administrador: consulta según permisos.
- Paciente: no accede a la Web.

## GraphQL

- `anthropometryByPatient(patientId)`.
- `latestSomatotype(patientId)`.
- `createAnthropometryMeasurement(input)`.
- `calculateSomatotype(input)`.

## Criterios para wireframe

- El formulario debe separar pliegues, diámetros y perímetros.
- La somatocarta debe aparecer junto al resultado numérico.
- Los campos deben mostrar unidades visibles.
- El error por datos incompletos debe mostrarse cerca del botón de cálculo.
