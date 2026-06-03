# Comandos útiles

## Desarrollo

```bash
npm run start:dev
```

## Compilación

```bash
npm run build
```

## Pruebas

```bash
npm run test
```

## Pruebas end-to-end

```bash
npm run test:e2e
```

## Lint

```bash
npm run lint
```

## Formato

```bash
npm run format
```

## Prisma esperado

```bash
npm install @prisma/client
npm install prisma --save-dev
npx prisma init
npx prisma migrate dev --name init_core_schema
npx prisma generate
```

Los comandos exactos pueden ajustarse según el `package.json` real del microservicio.
