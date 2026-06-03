# Tablas

## Objetivo

Mostrar listas operativas con filtros, paginación y acciones.

## Uso esperado

- Pacientes.
- Citas.
- Dietas.
- Alimentos del catálogo.
- Recetas.
- Plantillas.
- Documentos.
- Pagos o suscripciones.

## Elementos

- Búsqueda.
- Filtros.
- Ordenamiento.
- Paginación.
- Acciones por fila.
- Estado vacío.
- Estado de carga.

## Reglas

- Las tablas no deben consultar datos de otros tenants.
- Las acciones visibles dependen de permisos.
- Los filtros se traducen a filtros GraphQL del service correspondiente.
