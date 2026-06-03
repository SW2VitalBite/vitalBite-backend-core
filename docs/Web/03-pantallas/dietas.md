# Pantalla de dietas

## Objetivo

Crear, editar, asignar y consultar planes alimenticios.

## Funciones

- Crear dieta manual.
- Crear dieta desde plantilla.
- Definir comidas por día.
- Agregar alimentos, recetas o entradas manuales.
- Consultar dietocálculo.
- Solicitar PDF de dieta.
- Activar, completar o cancelar dieta.

## GraphQL

- `diets(filter)`.
- `dietById(id)`.
- `dietsByPatient(patientId)`.
- `activeDietByPatient(patientId)`.
- `createDiet(input)`.
- `updateDiet(id, input)`.
- `createDietFromTemplate(templateId, patientId, input)`.
- `calculateDietNutrition(input)`.
- `saveNutritionCalculation(input)`.
- `requestDietPdf(dietId)`.

## Reglas

- Cada ítem debe tener una sola fuente: catálogo, receta o manual.
- La dieta final conserva snapshot nutricional.
- Cambios en catálogo no deben alterar dietas históricas.
