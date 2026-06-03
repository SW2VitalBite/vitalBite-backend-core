# Submódulo de plantillas de dietas

## Objetivo

Crear planes alimenticios base que puedan reutilizarse y adaptarse a pacientes específicos.

## Actor principal

- Nutricionista.

## Responsabilidades

- Crear plantillas de dietas por objetivo nutricional.
- Definir comidas, horarios, alimentos, recetas y porciones base.
- Crear dietas reales para pacientes a partir de una plantilla.
- Ajustar la dieta generada según progreso, restricciones y objetivo individual.
- Alimentar generación de PDFs y reportes.

## Datos principales

- Plantilla.
- Objetivo.
- Comidas base.
- Ítems base.
- Recetas asociadas.
- Vigencia sugerida.
- Estado de la plantilla.

## Operaciones GraphQL esperadas

- `dietTemplates`
- `dietTemplateById`
- `createDietTemplate`
- `updateDietTemplate`
- `createDietFromTemplate`

## Reglas

- Una plantilla no reemplaza a la dieta asignada al paciente.
- La dieta generada desde plantilla debe quedar como registro independiente en `diets`.
- Las plantillas pertenecen a un tenant y deben validar permisos del nutricionista.
- Cada ítem de plantilla debe tener exactamente una fuente: catálogo, receta o entrada manual.
- Al crear una dieta desde plantilla, el Core debe copiar una foto nutricional a la dieta final.
- Cambios posteriores en la plantilla no deben modificar dietas ya generadas.
