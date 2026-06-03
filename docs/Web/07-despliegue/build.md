# Build

## Objetivo

Generar artefactos estáticos de la Web Angular para despliegue.

## Comando esperado

```bash
ng build
```

## Validación

- La compilación termina sin errores.
- Las variables de entorno apuntan al endpoint GraphQL correcto.
- Las rutas internas funcionan con configuración de servidor para SPA.
- No se incluyen secretos backend en el bundle.
