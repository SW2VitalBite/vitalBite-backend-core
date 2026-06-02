# Pruebas de integración

Las pruebas de integración validan módulos conectados con base de datos o servicios simulados.

## Objetivo

- Validar flujo resolver → service → base de datos.
- Validar autenticación y autorización.
- Validar separación por tenant.
- Validar integraciones mockeadas con .NET, Spring Boot y FastAPI.

## Casos sugeridos

- Usuario autenticado consulta pacientes de su tenant.
- Usuario no accede a datos de otro tenant.
- Core consulta .NET para validar suscripción.
- Core solicita PDF al servicio Documental.
- Core consulta resultado de riesgo nutricional.
