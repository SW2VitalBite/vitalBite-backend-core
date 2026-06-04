# Comandos útiles

## Desarrollo

```bash
pnpm run start:dev
```

## Compilación

```bash
pnpm run build
```

## Pruebas

```bash
pnpm run test
```

## Pruebas end-to-end

```bash
pnpm run test:e2e
```

## Lint

```bash
pnpm run lint
```

## Formato

```bash
pnpm run format
```

## Prisma esperado

```bash
pnpm add @prisma/client
pnpm add -D prisma
pnpm exec prisma init
pnpm exec prisma migrate dev --name init_core_schema
pnpm exec prisma generate
```

Los comandos exactos pueden ajustarse según el `package.json` real del microservicio.
