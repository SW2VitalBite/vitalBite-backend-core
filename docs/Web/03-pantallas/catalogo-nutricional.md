# Pantalla de catálogo nutricional

## Ruta

- `/nutrition-catalog`

## Actor principal

- Nutricionista.
- Administrador.

## Objetivo

Administrar alimentos, recetas y preparaciones reutilizables para dietas, plantillas y dietocálculo.

## Layout sugerido

- Header con título `Catálogo nutricional` y botón `Nuevo alimento`.
- Tabs: alimentos y recetas.
- Filtros por grupo alimenticio, búsqueda y creador.
- Tabla principal.
- Modal o panel lateral para formulario.

## Secciones visibles

- Alimentos del catálogo.
- Recetas reutilizables.
- Información nutricional base.
- Micronutrientes.
- Notas o restricciones.

## Tabla de alimentos y columnas

- Nombre.
- Grupo alimenticio.
- Porción base.
- Calorías.
- Proteínas.
- Carbohidratos.
- Grasas.
- Creador.
- Acciones.

## Tabla de recetas y columnas

- Nombre.
- Descripción.
- Calorías totales.
- Proteínas totales.
- Carbohidratos totales.
- Grasas totales.
- Cantidad de ítems.
- Acciones.

## Formulario de alimento

Campos:

- Nombre.
- Grupo alimenticio.
- Porción base.
- Calorías.
- Proteínas.
- Carbohidratos.
- Grasas.
- Micronutrientes.
- Notas.

## Formulario de receta

Campos:

- Nombre.
- Descripción.
- Ítems de receta.
- Alimento del catálogo.
- Cantidad.
- Unidad.

## Acciones principales

- Crear alimento.
- Editar alimento.
- Crear receta.
- Editar receta.
- Ver detalle nutricional.
- Usar alimento o receta en dieta.
- Usar alimento o receta en plantilla.

## Estados UI

- Cargando catálogo.
- Sin alimentos registrados.
- Sin recetas registradas.
- Error de validación nutricional.
- Guardado exitoso.
- Sin permisos para editar.

## Permisos

- Administrador: gestiona catálogo del tenant.
- Nutricionista: gestiona catálogo del tenant si tiene permiso.
- Paciente: no accede a la Web.

## GraphQL

- `foodCatalog(filter)`.
- `foodCatalogItemById(id)`.
- `recipes(filter)`.
- `recipeById(id)`.
- `createFoodCatalogItem(input)`.
- `updateFoodCatalogItem(id, input)`.
- `createRecipe(input)`.
- `updateRecipe(id, input)`.

## Criterios para wireframe

- Los tabs de alimentos y recetas deben ser visibles.
- La tabla debe permitir escanear calorías y macros rápidamente.
- El formulario de micronutrientes puede ser una lista dinámica.
- La receta debe permitir agregar varios alimentos del catálogo.
