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
- Barra de filtros encima de la tabla.
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
- Email.
- Teléfono.
- Objetivo nutricional.
- Estado.
- Nutricionista asignado.
- Última cita.
- Acciones.

## Formulario de paciente

Campos:

- Nombre.
- Apellido.
- Email.
- Teléfono.
- Fecha de nacimiento.
- Género.
- Objetivo nutricional.
- Notas clínicas.
- Estado.

Validaciones:

- Nombre y apellido obligatorios.
- Email con formato válido si se registra.
- Fecha de nacimiento no puede ser futura.
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
