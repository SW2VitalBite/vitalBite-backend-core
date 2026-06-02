# VitalBite Backend Core

API central del sistema VitalBite para nutricionistas (SaaS multi-tenant).

## Stack

- Node.js
- NestJS
- GraphQL (Apollo)

## Módulos de dominio

| Módulo | Responsabilidad |
|--------|-----------------|
| `tenants` | Aislamiento multi-tenant por nutricionista |
| `patients` | Gestión de pacientes |
| `appointments` | Citas y agendamiento |
| `body-measurements` | Medidas corporales |
| `diets` | Consumo diario y dietas personalizadas |
| `body-composition` | Monitoreo de composición corporal |
| `reports` | Generación y entrega de PDFs |

## Requisitos

- Node.js 20+
- npm 10+

## Configuración

```bash
cp .env.example .env
```

## Desarrollo

```bash
npm install
npm run start:dev
```

GraphQL Playground: `http://localhost:3000/graphql`

Query de prueba:

```graphql
query {
  health
}
```

## Scripts

| Comando | Descripción |
|---------|-------------|
| `npm run start:dev` | Servidor en modo watch |
| `npm run build` | Compilar para producción |
| `npm run start:prod` | Ejecutar build compilado |
| `npm run test` | Tests unitarios |
| `npm run test:e2e` | Tests end-to-end |
| `npm run lint` | Linter |

## Documentación

Ver carpeta `docs/` para requerimientos y arquitectura del proyecto.
