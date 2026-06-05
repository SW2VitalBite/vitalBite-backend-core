# Pantalla de plantillas de dietas

## Ruta

- `/diet-templates`

## Actor principal

- Nutricionista.

## Objetivo

Gestionar planes base reutilizables y generar dietas personalizadas desde plantillas.

## Layout sugerido

- Header con botón `Nueva plantilla`.
- Filtros por objetivo, estado y búsqueda.
- Tabla de plantillas.
- Editor de plantilla con comidas e ítems.
- Modal para generar dieta desde plantilla.

## Secciones visibles

- Lista de plantillas.
- Datos generales.
- Comidas base.
- Ítems base.
- Estado de la plantilla.
- Acción para generar dieta.

## Tabla y columnas

- Nombre.
- Objetivo.
- Estado.
- Nutricionista creador.
- Número de comidas.
- Última actualización.
- Acciones.

## Formulario de plantilla

Campos generales:

- Nombre.
- Objetivo.
- Estado.

Campos por comida:

- Nombre de comida.
- Hora sugerida.
- Orden.

Campos por ítem:

- Fuente: catálogo, receta o manual.
- Alimento o receta.
- Nombre manual si aplica.
- Porción.
- Snapshot nutricional sugerido.
- Notas.

## Modal para generar dieta

Campos:

- Paciente.
- Fecha de inicio.
- Fecha de fin.
- Ajustes.

## Acciones principales

- Crear plantilla.
- Editar plantilla.
- Archivar plantilla.
- Generar dieta para paciente.
- Ver detalle.

## Estados UI

- Cargando plantillas.
- Sin plantillas registradas.
- Plantilla guardada.
- Dieta generada.
- Error de fuente duplicada.
- Sin permisos para editar.

## Permisos

- Nutricionista: crea y usa plantillas del tenant.
- Administrador: consulta o administra según permisos.
- Paciente: no accede a la Web.

## GraphQL

- `dietTemplates(filter)`.
- `dietTemplateById(id)`.
- `createDietTemplate(input)`.
- `updateDietTemplate(id, input)`.
- `createDietFromTemplate(templateId, patientId, input)`.

## Criterios para wireframe

- La tabla debe separar plantillas activas y archivadas mediante filtro.
- El editor debe parecerse al editor de dietas.
- El modal de generación debe dejar claro que se crea una dieta independiente.
