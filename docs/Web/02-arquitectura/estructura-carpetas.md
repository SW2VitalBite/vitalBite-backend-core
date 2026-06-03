# Estructura de carpetas

Estructura sugerida para la futura aplicación Angular:

```text
src/app/
├── core/
│   ├── graphql/
│   ├── guards/
│   ├── interceptors/
│   ├── models/
│   └── services/
├── shared/
│   ├── components/
│   ├── pipes/
│   └── validators/
├── layout/
│   ├── main-layout/
│   ├── sidebar/
│   └── topbar/
├── features/
│   ├── auth/
│   ├── dashboard/
│   ├── patients/
│   ├── appointments/
│   ├── body-measurements/
│   ├── nutrition-tracking/
│   ├── diets/
│   ├── nutrition-catalog/
│   ├── diet-templates/
│   ├── anthropometry/
│   ├── documents-reports/
│   ├── payments-subscriptions/
│   └── settings/
└── app.routes.ts
```

## Criterio de organización

- Cada feature agrupa páginas, componentes internos y service propio.
- `core` contiene infraestructura compartida.
- `shared` contiene UI reutilizable sin reglas de negocio.
- `layout` contiene navegación global.
