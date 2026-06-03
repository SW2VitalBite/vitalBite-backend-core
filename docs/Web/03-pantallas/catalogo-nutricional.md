# Pantalla de catálogo nutricional

## Objetivo

Administrar alimentos, recetas y preparaciones reutilizables.

## Funciones

- Listar alimentos.
- Crear o editar alimento.
- Registrar calorías, macronutrientes y micronutrientes.
- Crear recetas con alimentos del catálogo.
- Consultar recetas reutilizables.

## GraphQL

- `foodCatalog(filter)`.
- `foodCatalogItemById(id)`.
- `recipes(filter)`.
- `recipeById(id)`.
- `createFoodCatalogItem(input)`.
- `updateFoodCatalogItem(id, input)`.
- `createRecipe(input)`.
- `updateRecipe(id, input)`.

## Reglas

- Administrador y nutricionista pueden gestionar catálogo del tenant.
- El catálogo alimenta dietas, plantillas y dietocálculo.
- La Web debe validar datos nutricionales antes de enviar mutation.
