# Manejo de errores GraphQL

## Tipos de error

- Autenticación inválida.
- Token expirado.
- Permiso insuficiente.
- Recurso de otro tenant.
- Validación de formulario.
- Error de integración documental, IA o pagos.
- Error de red.

## Comportamiento esperado

- Mostrar mensajes claros al usuario.
- Redirigir a `/login` si el token expiró.
- Ocultar acciones sin permiso.
- Mantener datos anteriores si una actualización falla.
- Registrar error técnico solo en desarrollo.

## Reglas

- No mostrar stack traces.
- No exponer tokens.
- No mostrar detalles internos de microservicios.
- Convertir errores GraphQL en estados de UI: carga, error, vacío o éxito.
