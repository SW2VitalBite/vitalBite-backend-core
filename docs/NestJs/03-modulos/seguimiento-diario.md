# Submódulo de seguimiento diario

## Objetivo

Permitir que el paciente registre información diaria desde la app móvil para mejorar el seguimiento nutricional.

## Actores

- Paciente.
- Nutricionista.

## Responsabilidades

- Registrar adherencia diaria al plan.
- Registrar fotos de alimentos consumidos.
- Registrar actividad física.
- Registrar estado de ánimo o motivación.
- Registrar metas del paciente.
- Entregar información al nutricionista y al dashboard BI.

## Datos principales

- Paciente.
- Fecha.
- Dieta asociada.
- Porcentaje de adherencia.
- Fotos de alimentos.
- Actividad física.
- Estado de ánimo.
- Metas.
- Observaciones del paciente.

## Operaciones GraphQL esperadas

- `dailyTrackingByPatient`
- `patientGoals`
- `createDailyTrackingEntry`
- `requestDailyFoodPhotoUpload`
- `addDailyFoodPhoto`
- `addPhysicalActivityEntry`
- `createPatientGoal`
- `updatePatientGoal`
- `completePatientGoal`
- `cancelPatientGoal`

## Reglas

- El paciente solo puede registrar y consultar su propio seguimiento diario.
- El nutricionista puede consultar seguimiento diario de pacientes asignados.
- Las fotos se almacenan como metadatos o referencias; el archivo binario debe vivir en S3 mediante el servicio Documental.

## Flujo de fotos de alimentos

1. La app móvil solicita `requestDailyFoodPhotoUpload(input)` al Core.
2. El Core solicita al servicio Documental una URL prefirmada y crea metadato documental.
3. La app móvil sube la foto a S3 usando la URL prefirmada.
4. La app móvil llama `addDailyFoodPhoto(input)` para asociar `documentMetadataId` al seguimiento diario.
5. El Core guarda solo referencias y metadatos; nunca almacena el binario.
