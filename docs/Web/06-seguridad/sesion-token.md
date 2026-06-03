# Sesión y token

## Estrategia

La Web guarda el JWT según `NG_APP_TOKEN_STORAGE`:

- `localStorage`: mantiene sesión entre recargas.
- `sessionStorage`: cierra sesión al cerrar navegador.

## Envío del token

El token se agrega en el header de operaciones GraphQL protegidas.

```text
Authorization: Bearer <token>
```

## Reglas

- Limpiar token en logout.
- Limpiar token si el Core responde error de autenticación.
- No guardar datos sensibles innecesarios.
- Mantener usuario autenticado en memoria o estado controlado.
