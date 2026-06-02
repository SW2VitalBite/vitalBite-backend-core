# Estructura de carpetas

Estructura sugerida para el microservicio NestJS.

```text
src/
├── app.module.ts
├── main.ts
├── config/
├── common/
│   ├── decorators/
│   ├── guards/
│   ├── interceptors/
│   └── filters/
├── auth/
├── users/
├── roles/
├── patients/
├── appointments/
├── body-measures/
├── nutrition-tracking/
├── diets/
├── dashboard/
└── integrations/
    ├── payments/
    ├── documents/
    └── ai/
```

## Criterio de organización

- Cada módulo debe tener resolver, service y definición de datos.
- Las integraciones externas deben separarse del dominio interno.
- La lógica repetida debe vivir en `common`.
- La configuración debe centralizarse en `config`.
