# Pantalla de dietas

## Ruta

- `/diets`

## Actor principal

- Nutricionista.

## Objetivo

Crear, editar, calcular y asignar planes alimenticios personalizados.

## Layout sugerido

- Header con botón `Nueva dieta`.
- Filtros por paciente, nutricionista, estado y fecha.
- Tabla de dietas.
- Editor de dieta en pantalla completa o panel amplio.
- Panel lateral de dietocálculo.

## Secciones visibles

- Lista de dietas.
- Datos generales del plan.
- Comidas por día.
- Ítems alimenticios.
- Resultado de dietocálculo.
- Estado del plan.
- Acciones documentales.

## Tabla y columnas

- Nombre de dieta.
- Paciente.
- Objetivo.
- Estado.
- Fecha de inicio.
- Fecha de fin.
- Calorías totales.
- Última actualización.
- Acciones.

## Formulario de dieta

Campos generales:

- Paciente.
- Nombre.
- Objetivo.
- Fecha de inicio.
- Fecha de fin.
- Estado.

Campos por comida:

- Nombre de comida.
- Hora.
- Orden.

Campos por ítem:

- Fuente: catálogo, receta o manual.
- Alimento o receta.
- Nombre manual si aplica.
- Porción.
- Snapshot nutricional.
- Notas.

## Dietocálculo

Debe mostrar:

- Calorías totales.
- Proteínas.
- Carbohidratos.
- Grasas.
- Micronutrientes.
- Botón `Calcular`.
- Botón `Guardar cálculo`.

## Acciones principales

- Crear dieta manual.
- Crear dieta desde plantilla.
- Editar dieta.
- Activar dieta.
- Completar dieta.
- Cancelar dieta.
- Calcular nutrientes.
- Guardar cálculo.
- Solicitar PDF.

## Estados UI

- Cargando dietas.
- Sin dietas registradas.
- Dieta guardada.
- Cálculo generado.
- Error de fuente duplicada en ítem.
- Error al solicitar PDF.
- Sin permisos para editar.

## Permisos

- Nutricionista: gestiona dietas de pacientes asignados.
- Administrador: consulta dietas del tenant según permisos.
- Paciente: no accede a la Web.

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

## Criterios para wireframe

- El editor debe mostrar comidas como bloques repetibles.
- El panel de dietocálculo debe ser visible al editar.
- Cada ítem debe dejar clara su fuente.
- El snapshot nutricional debe verse como resumen no editable o calculado.
