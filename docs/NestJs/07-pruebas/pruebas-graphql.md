# Pruebas GraphQL

Las pruebas GraphQL validan queries y mutations expuestas por el Core.

## Objetivo

- Verificar schema.
- Validar queries principales.
- Validar mutations principales.
- Confirmar errores de autorización.
- Confirmar estructura de respuesta.

## Casos sugeridos

- `login` devuelve token.
- `patients` requiere autenticación.
- `createPatient` requiere permiso.
- `appointments` filtra por tenant.
- `requestDietPdf` devuelve información documental.

## Validaciones esperadas

- Código de error controlado.
- Respuesta GraphQL consistente.
- No exposición de datos sensibles.
