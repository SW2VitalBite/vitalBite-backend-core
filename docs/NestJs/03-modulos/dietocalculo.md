# Submódulo de dietocálculo

## Objetivo

Calcular el aporte nutricional de dietas, comidas, recetas y alimentos dentro del Core NestJS.

## Actor principal

- Nutricionista.

## Responsabilidades

- Calcular calorías totales de una dieta.
- Calcular macronutrientes: proteínas, carbohidratos y grasas.
- Registrar micronutrientes cuando el alimento o receta los tenga definidos.
- Consolidar resultados por alimento, comida y dieta completa.
- Alimentar reportes nutricionales, seguimiento y dashboard BI.

## Datos principales

- Dieta.
- Comida.
- Ítem alimenticio.
- Calorías.
- Proteínas.
- Carbohidratos.
- Grasas.
- Micronutrientes.
- Resultado de cálculo nutricional.

## Operaciones GraphQL esperadas

- `calculateDietNutrition`
- `nutritionCalculationByDiet`
- `nutritionCalculationsByPatient`

## Reglas

- El dietocálculo pertenece al Core empresarial porque usa datos transaccionales de dietas, alimentos y recetas.
- FastAPI puede apoyar análisis visual de alimentos, pero no reemplaza el cálculo nutricional base.
- Los cálculos deben respetar `tenant_id`, paciente y nutricionista asignado.
- `calculateDietNutrition(input)` calcula y devuelve el resultado sin persistirlo.
- `saveNutritionCalculation(input)` persiste historial y requiere `dietId`.
- `patientId` se deriva desde la dieta cuando se guarda el resultado.
- No se guardan cálculos nutricionales huérfanos.
