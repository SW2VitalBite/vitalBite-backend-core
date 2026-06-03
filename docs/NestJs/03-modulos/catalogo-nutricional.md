# Submódulo de catálogo nutricional

## Objetivo

Registrar alimentos, recetas y preparaciones reutilizables para crear dietas con mayor rapidez y consistencia nutricional.

## Actor principal

- Nutricionista.
- Administrador.

## Responsabilidades

- Crear alimentos del catálogo.
- Registrar valores nutricionales por porción.
- Crear recetas compuestas por alimentos del catálogo.
- Reutilizar alimentos y recetas en dietas y plantillas.
- Mantener separación por tenant.

## Datos principales

- Alimento.
- Receta.
- Porción base.
- Grupo alimenticio.
- Calorías.
- Macronutrientes.
- Micronutrientes.
- Restricciones o notas.

## Operaciones GraphQL esperadas

- `foodCatalog`
- `foodCatalogItemById`
- `recipes`
- `recipeById`
- `createFoodCatalogItem`
- `updateFoodCatalogItem`
- `createRecipe`
- `updateRecipe`

## Reglas

- Los alimentos y recetas pueden ser administrados por nutricionistas o administradores del tenant.
- El paciente no administra catálogo nutricional.
- El catálogo alimenta dietas, plantillas, dietocálculo y reportes.
