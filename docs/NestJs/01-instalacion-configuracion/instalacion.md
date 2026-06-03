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
5. Agregar Prisma si aún no está instalado.
6. Crear carpeta `prisma/` y archivo `schema.prisma`.
7. Crear `PrismaService` dentro del Core para centralizar acceso a base de datos.
8. Ejecutar migraciones si el proyecto las tiene habilitadas.

## Preparación Prisma esperada

Antes de implementar los módulos transaccionales, el proyecto debe contar con:

- Dependencias `prisma` y `@prisma/client`.
- Archivo `prisma/schema.prisma`.
- Configuración de conexión mediante `DATABASE_URL`.
- `PrismaService` reutilizable por los services del Core.
- Migraciones versionadas para PostgreSQL/Supabase.

## Ejecución local

```bash
npm run start:dev
```

## Verificación

El servicio debe iniciar sin errores y exponer el endpoint GraphQL configurado para el Core.
