# Pantalla de auditoría y bitácora

## Ruta

- `/audit-log`

## Actor principal

- Administrador.

## Objetivo

Consultar eventos críticos del sistema, trazabilidad, hashes y referencias blockchain.

## Layout sugerido

- Header con título `Auditoría y bitácora`.
- Filtros avanzados.
- Tabla de eventos.
- Panel de detalle del evento.
- Indicador de integridad o hash.

## Secciones visibles

- Eventos recientes.
- Filtros por usuario, recurso, acción y fecha.
- Tabla de auditoría.
- Detalle del evento.
- Referencia blockchain cuando exista.

## Tabla y columnas

- Fecha.
- Usuario.
- Rol.
- Acción.
- Recurso afectado.
- Tipo de recurso.
- Hash.
- Referencia blockchain.
- Acciones.

## Filtros

- Usuario.
- Tipo de acción.
- Recurso.
- Fecha desde.
- Fecha hasta.
- Tiene referencia blockchain.

## Detalle del evento

Campos visibles:

- ID de evento.
- Usuario.
- Tenant.
- Fecha.
- Acción.
- Recurso afectado.
- Datos relevantes.
- Hash.
- Referencia blockchain.
- Origen del evento.

## Acciones principales

- Filtrar eventos.
- Ver detalle.
- Copiar hash.
- Copiar referencia blockchain.
- Descargar reporte si el servicio documental lo permite.

## Estados UI

- Cargando eventos.
- Sin eventos para filtros.
- Error al cargar bitácora.
- Sin permisos para consultar.
- Hash copiado.

## Permisos

- Administrador: consulta eventos del tenant.
- Nutricionista: no accede salvo permiso explícito.
- Paciente: no accede a la Web.

## GraphQL

- `auditEvents(filter)`.
- `auditEventById(id)`.

## Criterios para wireframe

- La tabla debe permitir escanear fecha, usuario, acción y recurso.
- El hash debe mostrarse abreviado con opción de copiar.
- La referencia blockchain debe mostrarse como identificador técnico.
- El detalle debe abrirse en panel lateral o modal.
