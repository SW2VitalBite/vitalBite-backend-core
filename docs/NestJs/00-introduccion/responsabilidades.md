# Responsabilidades del Core NestJS

## Responsabilidades principales

- Exponer la API GraphQL principal para Angular y React Native.
- Gestionar datos transaccionales del Core empresarial.
- Validar identidad, roles, permisos y tenant.
- Centralizar reglas del negocio nutricional.
- Orquestar comunicación con otros microservicios.

## Responsabilidades por módulo

| Módulo | Responsabilidad |
|---|---|
| Usuarios y roles | Control de acceso, perfiles y permisos |
| Pacientes | Registro y administración de pacientes |
| Citas | Agenda, confirmación, reprogramación y cancelación |
| Medidas corporales | Registro de evolución física |
| Seguimiento nutricional | Control de progreso y cumplimiento |
| Dietas | Creación y asignación de planes alimenticios |
| Dietocálculo | Cálculo nutricional de dietas, comidas y recetas |
| Catálogo nutricional | Gestión de alimentos, recetas y preparaciones |
| Plantillas de dietas | Planes base reutilizables para crear dietas |
| Seguimiento diario | Registro diario del paciente desde la app móvil |
| Antropometría avanzada | Pliegues, diámetros, somatotipo y somatocarta |

## Fuera de alcance

- Pagos y suscripciones: gestionados por .NET y DynamoDB.
- Documentos, PDFs, S3 y blockchain: gestionados por Spring Boot.
- OCR, análisis visual de imágenes, Random Forest y K-means: gestionados por FastAPI.
