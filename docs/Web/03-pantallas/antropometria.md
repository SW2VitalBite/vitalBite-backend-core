# Pantalla de antropometría avanzada

## Objetivo

Registrar pliegues, diámetros, somatotipo y somatocarta.

## Funciones

- Registrar antropometría avanzada.
- Consultar historial.
- Calcular somatotipo.
- Visualizar coordenadas de somatocarta.

## GraphQL

- `anthropometryByPatient(patientId)`.
- `latestSomatotype(patientId)`.
- `createAnthropometryMeasurement(input)`.
- `calculateSomatotype(input)`.

## Reglas

- Usar fórmula Heath-Carter documentada en el Core.
- Pliegues en mm.
- Diámetros y perímetros en cm.
- Si faltan datos mínimos, mostrar error controlado.
