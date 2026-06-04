# Instalación

## Instalación base

```bash
pnpm install
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
pnpm run start:dev
```

## Verificación

El servicio debe iniciar sin errores y exponer el endpoint GraphQL configurado para el Core.

## Estado local implementado: pacientes y citas

Los slices transaccionales iniciales ya incluyen Prisma para PostgreSQL local, `PrismaService`, migraciones de pacientes/citas y seed demo.

Preparacion recomendada:

```bash
createdb vitalbite_core
cp .env.example .env
pnpm run prisma:generate
pnpm run prisma:migrate
pnpm run prisma:seed
pnpm run start:dev
```

Editar `.env` antes de migrar si el usuario, clave, host, puerto o nombre de base de datos local son diferentes.

Query rapida para validar GraphQL:

```graphql
query {
  patients {
    id
    fullName
    status
    nutritionGoal
  }
}
```
