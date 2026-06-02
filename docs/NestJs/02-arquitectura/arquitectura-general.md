# Arquitectura general del Core NestJS

El Core NestJS se organiza como un microservicio modular que expone GraphQL y persiste datos transaccionales en PostgreSQL/Supabase.

## Capas principales

- **Resolvers GraphQL:** reciben consultas y mutaciones desde clientes.
- **Services:** contienen reglas de negocio.
- **Repositories/ORM:** administran acceso a PostgreSQL/Supabase.
- **Guards:** protegen rutas GraphQL mediante JWT, roles y permisos.
- **DTO/Input Types:** definen entradas de GraphQL.
- **Entities/Models:** representan tablas o modelos del dominio.

## Integraciones

| Servicio | Uso desde Core |
|---|---|
| .NET Pagos | Validar plan, suscripción y límites del tenant |
| Spring Boot Documental | Solicitar generación de PDFs y auditoría documental |
| FastAPI IA/ML/DL | Consultar predicciones o resultados analíticos |
| DynamoDB | Consultar métricas, BI o indicadores financieros cuando corresponda |

## Principio central

El Core no reemplaza a los microservicios especializados. Solo coordina flujos empresariales y expone la información necesaria mediante GraphQL.
