# Instalación

## Instalación base

```bash
npm install
```

## Configuración inicial

1. Crear el archivo `.env`.
2. Configurar conexión a PostgreSQL/Supabase.
3. Configurar secretos JWT.
4. Configurar URLs de microservicios externos.
5. Ejecutar migraciones si el proyecto las tiene habilitadas.

## Ejecución local

```bash
npm run start:dev
```

## Verificación

El servicio debe iniciar sin errores y exponer el endpoint GraphQL configurado para el Core.
