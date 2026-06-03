# Pantalla de plantillas de dietas

## Objetivo

Gestionar planes base reutilizables para acelerar creación de dietas.

## Funciones

- Listar plantillas.
- Crear plantilla.
- Editar comidas e ítems base.
- Usar alimentos, recetas o entradas manuales.
- Generar dieta para paciente desde plantilla.

## GraphQL

- `dietTemplates(filter)`.
- `dietTemplateById(id)`.
- `createDietTemplate(input)`.
- `updateDietTemplate(id, input)`.
- `createDietFromTemplate(templateId, patientId, input)`.

## Reglas

- Las plantillas pertenecen al tenant.
- Una dieta generada desde plantilla queda como dieta independiente.
- Cambios posteriores en plantilla no modifican dietas ya generadas.
