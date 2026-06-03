# Submódulo de antropometría avanzada

## Objetivo

Complementar las medidas corporales con pliegues, diámetros, somatotipo y somatocarta.

## Actor principal

- Nutricionista.

## Responsabilidades

- Registrar pliegues corporales.
- Registrar diámetros corporales.
- Registrar perímetros necesarios para somatotipo.
- Calcular o almacenar resultado de somatotipo.
- Consultar somatocarta y evolución antropométrica.
- Alimentar seguimiento, reportes y modelos de ML.

## Datos principales

- Paciente.
- Medición corporal asociada.
- Pliegues.
- Diámetros.
- Perímetros.
- Endomorfia.
- Mesomorfia.
- Ectomorfia.
- Coordenadas de somatocarta.

## Operaciones GraphQL esperadas

- `anthropometryByPatient`
- `latestSomatotype`
- `createAnthropometryMeasurement`
- `calculateSomatotype`

## Reglas

- La antropometría avanzada pertenece al módulo de medidas corporales.
- La somatocarta se calcula cuando existan datos suficientes.
- Los registros deben ser históricos y auditables.

## Cálculo de somatotipo

- La fórmula de referencia será Heath-Carter por su uso académico en somatotipo y somatocarta.
- Pliegues corporales se registran en milímetros.
- Perímetros y diámetros se registran en centímetros.
- Peso se registra en kilogramos.
- Talla se registra en centímetros.

Campos mínimos para calcular:

- Peso.
- Talla.
- Pliegue tricipital.
- Pliegue subescapular.
- Pliegue suprailiaco.
- Pliegue de pantorrilla.
- Perímetro de brazo contraído.
- Perímetro de pantorrilla.
- Diámetro de húmero.
- Diámetro de fémur.

Si faltan datos mínimos, `calculateSomatotype` debe responder con error controlado y no crear `SomatotypeResult`.
