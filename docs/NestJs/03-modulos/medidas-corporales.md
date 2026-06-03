# Módulo de medidas corporales

## Objetivo

Registrar y consultar la evolución corporal del paciente.

## Actor principal

- Nutricionista.

## Responsabilidades

- Registrar peso, talla e IMC.
- Registrar perímetros corporales.
- Registrar datos de composición corporal.
- Registrar pliegues, diámetros y datos de antropometría avanzada.
- Calcular o consultar somatotipo y somatocarta.
- Consultar evolución por paciente.
- Alimentar reportes, seguimiento y modelos de ML.

## Datos principales

- Peso.
- Talla.
- IMC.
- Cintura.
- Cadera.
- Porcentaje de grasa.
- Masa muscular.
- Agua corporal.
- Datos de bioimpedancia.
- Pliegues corporales.
- Diámetros corporales.
- Somatotipo.
- Somatocarta.

## Operaciones GraphQL esperadas

- `bodyMeasuresByPatient`
- `createBodyMeasure`
- `updateBodyMeasure`
- `deleteBodyMeasure`
- `anthropometryByPatient`
- `createAnthropometryMeasurement`
- `calculateSomatotype`
- `latestSomatotype`

## Submódulo relacionado

- `antropometria-avanzada`: amplía las medidas corporales con pliegues, diámetros, somatotipo y somatocarta.
