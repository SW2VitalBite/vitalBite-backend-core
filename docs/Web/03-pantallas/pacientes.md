# Pantalla de pacientes

## Ruta

- `/patients`
- `/patients/:id`

## Actor principal

- Nutricionista.
- Administrador.

## Objetivo

Gestionar pacientes desde la Web y servir como punto de entrada al expediente nutricional.

## Layout sugerido

- Header con título `Pacientes`, descripción breve y botón principal `Nuevo paciente`.
- Acciones superiores `Filtros` y `Nuevo paciente`.
- Fila de indicadores: activos, inactivos, archivados y seguimiento.
- Barra de filtros encima de la tabla con buscador, estado, registro y botón `Aplicar`.
- Tabla/lista principal de pacientes.
- Panel o página de detalle del paciente.
- Tabs internos en detalle: resumen, citas, medidas, seguimiento, dietas y documentos.

## Secciones visibles

- Resumen de pacientes activos, inactivos y archivados.
- Buscador por nombre, email o teléfono.
- Filtros por estado, nutricionista y fecha de registro.
- Tabla de pacientes.
- Detalle del paciente con información clínica y nutricional.

## Tabla y columnas

- Nombre completo.
- Estado.
- Objetivo nutricional.
- Última cita.
- Acciones.

## Formulario de paciente

Campos:

- Nombre completo.
- Email.
- Teléfono.
- Estado del paciente.
- Objetivo nutricional.
- Nutricionista asignado como dato informativo.
- Notas clínicas.

Validaciones:

- Nombre completo obligatorio.
- Email con formato válido si se registra.
- Estado debe ser válido.

## Acciones principales

- Crear paciente.
- Editar paciente.
- Archivar paciente.
- Ver detalle.
- Ir a citas del paciente.
- Ir a medidas del paciente.
- Ir a dietas del paciente.
- Ir a seguimiento del paciente.
- Ir a documentos del paciente.

## Estados UI

- Cargando lista.
- Sin pacientes registrados.
- Sin resultados para filtros.
- Error al cargar pacientes.
- Guardado exitoso.
- Sin permisos para crear o editar.

## Permisos

- Administrador: consulta pacientes del tenant y puede asignar nutricionista.
- Nutricionista: consulta y edita pacientes asignados.
- Paciente: no accede a la Web.

## GraphQL

- `patients(filter)`.
- `patientById(id)`.
- `patientsByNutritionist(nutritionistId)`.
- `createPatient(input)`.
- `updatePatient(id, input)`.
- `archivePatient(id)`.
- `assignPatientToNutritionist(patientId, nutritionistId)`.

## Criterios para wireframe

- La tabla debe ocupar el área central.
- El botón `Nuevo paciente` debe estar en el header.
- Los filtros deben estar visibles antes de la tabla.
- El detalle del paciente debe permitir navegar a módulos relacionados sin volver al listado.
- Las acciones por fila deben estar agrupadas en un menú o columna de acciones.
- El modal debe mostrar tarjetas de contexto: tenant, responsable y estado inicial.
- El detalle debe mostrar tabs visuales, resumen clínico, próxima cita, módulos relacionados y acciones del paciente.

## Datos demo

El seed del Core carga pacientes, citas y medidas asociadas a `Clinica Central` para validar visualmente:

- Ana Rojas.
- Luis Pinto.
- Marta Silva.
- Carlos Meza.
- Sofia Arias.

Estos datos alimentan la tabla, la última cita, el detalle clínico y los indicadores sin usar datos estáticos en Angular.
