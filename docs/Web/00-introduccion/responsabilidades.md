# Responsabilidades de la Web

## Responsabilidades principales

- Presentar la interfaz administrativa para nutricionistas y administradores.
- Consumir el Core NestJS mediante GraphQL.
- Gestionar estado de sesión y token JWT.
- Mostrar información empresarial y nutricional de forma clara.
- Validar formularios antes de enviar operaciones al Core.
- Manejar estados de carga, error, vacío y éxito.

## Responsabilidades por módulo

| Módulo Web | Responsabilidad |
|---|---|
| Login | Autenticación y apertura de sesión |
| Dashboard | Indicadores administrativos, BI y nutricionales |
| Pacientes | Registro, edición, búsqueda y detalle de pacientes |
| Citas | Agenda, confirmación, reprogramación y cancelación |
| Medidas corporales | Registro de peso, IMC, composición y antropometría |
| Seguimiento nutricional | Progreso, adherencia, alertas y seguimiento diario |
| Dietas | Creación de dietas, plantillas y dietocálculo |
| Catálogo nutricional | Alimentos, recetas y preparaciones reutilizables |
| Documentos y reportes | Solicitud, descarga y visualización de reportes |
| Pagos y suscripciones | Estado de plan, límites, pagos y renovaciones |
| Configuración | Perfil, tenant, preferencias y permisos visibles |

## Fuera de alcance

- No procesa pagos directamente; consulta información del Core y microservicio .NET.
- No ejecuta modelos de IA/ML; consume resultados integrados por el Core.
- No reemplaza la app móvil del paciente.
