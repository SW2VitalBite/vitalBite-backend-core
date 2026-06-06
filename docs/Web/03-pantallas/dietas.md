# Pantalla de dietas

## Ruta

- `/patients/:id/diets`

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
## MVP implementado

Rutas:

- `/patients/:id/diets`: lista de planes alimenticios del paciente, filtros visuales y panel lateral.
- `/patients/:id/diets/:dietId/edit`: editor semanal de Lunes a Domingo con horarios dinamicos, comidas e items manuales.

La ruta global `/diets` no se expone; Dietas se abre desde el expediente del paciente.

GraphQL implementado:

- `diets(filter)`.
- `dietById(id)`.
- `dietsByPatient(patientId)`.
- `activeDietByPatient(patientId)`.
- `createDietPlan(input)`.
- `updateDietPlan(id, input)`.
- `updateDietPlanStructure(id, input)`.
- `changeDietPlanStatus(id, status)`.
- `duplicateDietPlanDay(input)`.

Alcance:

- Estados: `Activo`, `Borrador`, `Ajustar`.
- Los items del plan son manuales y guardan nombre, porcion y calorias.
- El editor semanal usa 7 columnas fijas, de Lunes a Domingo.
- La nutricionista puede crear N filas de horarios; cada fila representa una comida compartida por todos los dias.
- Cada celda de dia y horario permite editar alimentos inline con nombre, porcion y calorias.
- La hora de cada comida se guarda en la estructura del plan sin cambiar el contrato GraphQL.
- `Vence pronto` se calcula desde la fecha de fin del plan.
- Catalogo nutricional, dietocalculo avanzado y exportacion PDF real quedan para una fase posterior.

Feedback UI:

- La lista del paciente muestra mensajes locales cuando un plan se crea correctamente o cuando falla la creacion.
- El editor muestra mensajes locales al guardar borrador, actualizar plan o duplicar un dia.
- Durante una accion de guardado se deshabilitan los CTAs principales y el texto cambia a `Guardando...`, `Actualizando...` o `Duplicando...`.
- Las acciones `Exportar dieta`, `Exportar PDF`, `Abrir biblioteca` y `Filtros` quedan visibles como accesos preparados, deshabilitados y con nota de proxima fase documental.
