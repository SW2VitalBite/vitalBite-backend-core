# Objetivo de la Web

## Objetivo general

Proveer una interfaz Angular para que administradores y nutricionistas operen VitalBite de forma segura, modular y alineada al Core GraphQL.

## Objetivos funcionales

- Autenticar usuarios administrativos.
- Gestionar pacientes y su información nutricional.
- Gestionar citas y calendario.
- Registrar medidas corporales, composición corporal y antropometría avanzada.
- Crear dietas, usar plantillas, consultar dietocálculo y administrar catálogo nutricional.
- Revisar seguimiento nutricional y seguimiento diario del paciente.
- Generar y consultar documentos y reportes.
- Consultar dashboard BI.
- Gestionar pagos, suscripciones y límites del tenant desde información provista por el Core.

## Objetivos técnicos

- Usar Angular como framework principal.
- Consumir GraphQL mediante services organizados por dominio.
- Proteger rutas con guards de autenticación, rol y permisos.
- Mantener componentes reutilizables para tablas, formularios, gráficos, modales y estados.
- Separar pantallas, services, modelos, guards e interceptores.
