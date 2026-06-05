# Módulo de dietas

## Objetivo

Crear y asignar planes alimenticios personalizados.

## Actor principal

- Nutricionista.

## Responsabilidades

- Crear dietas.
- Definir comidas por día.
- Asignar alimentos, recetas, porciones y restricciones.
- Usar catálogo nutricional para seleccionar alimentos y preparaciones.
- Crear dietas desde plantillas reutilizables.
- Solicitar dietocálculo de calorías, macronutrientes y micronutrientes.
- Asociar dieta a un paciente.
- Actualizar dieta según progreso.
- Solicitar generación de PDF al servicio Documental.

## Datos principales

- Dieta.
- Comida.
- Alimento.
- Receta.
- Porción.
- Restricción.
- Objetivo.
- Vigencia.
- Resultado de dietocálculo.
- Plantilla de dieta.

## Operaciones GraphQL esperadas

- `diets`
- `dietById`
- `dietsByPatient`
- `createDiet`
- `updateDiet`
- `assignDietToPatient`
- `createDietFromTemplate`
- `calculateDietNutrition`
- `requestDietPdf`

## Submódulos relacionados

- `dietocalculo`: calcula calorías, macronutrientes y micronutrientes.
- `catalogo-nutricional`: provee alimentos y recetas reutilizables.
- `plantillas-dietas`: permite generar dietas desde planes base.

## Reglas de ítems alimenticios

- Un ítem de dieta puede originarse desde catálogo, receta o entrada manual.
- Cada ítem debe tener exactamente una fuente: `foodCatalogItemId`, `recipeId` o `manualFoodName`.
- La dieta final debe guardar una foto nutricional del ítem: nombre, porción, calorías, proteínas, carbohidratos, grasas y micronutrientes.
- Cambios posteriores en catálogo o recetas no deben alterar dietas históricas ya asignadas.
## MVP implementado

El primer slice funcional de dietas cubre planes por paciente con estructura persistente:

- `DietPlan`: datos generales, objetivo, vigencia, estado, restriccion, notas y adherencia.
- `DietPlanDay`: dias del plan.
- `DietMeal`: comidas por dia.
- `DietMealItem`: alimentos manuales con porcion y calorias.

Operaciones GraphQL implementadas:

- `diets(filter)`.
- `dietById(id)`.
- `dietsByPatient(patientId)`.
- `activeDietByPatient(patientId)`.
- `createDietPlan(input)`.
- `updateDietPlan(id, input)`.
- `updateDietPlanStructure(id, input)`.
- `changeDietPlanStatus(id, status)`.
- `duplicateDietPlanDay(input)`.

Quedan para fases posteriores:

- Catalogo nutricional.
- Plantillas reutilizables.
- Calculo macro/micronutrientes.
- PDF real desde el microservicio documental.
