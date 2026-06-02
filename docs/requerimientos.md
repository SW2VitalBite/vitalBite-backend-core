# Gestión de Citas

- La nutricionista recibe solicitudes de citas de pacientes y responde confirmando disponibilidad
- Se propone automatizar el proceso con un bot de WhatsApp para que los pacientes agenden directamente sin hablar con la nutricionista
- Caso de uso identificado: **gestionar cita**

## Información Básica del Paciente

- En la primera consulta, se recopila información básica: nombre, apellido, altura, alergias y otros datos fundamentales
- Se utiliza el caso de uso existente de gestionar paciente sin necesidad de crear uno adicional

## Medidas Corporales

- La nutricionista mide el grosor en centímetros de diferentes extremidades: brazo, pierna, abdomen, antebrazo, etc.
- Caso de uso: **gestionar medidas corporales**

## Gestión de Dietas

- Se pregunta al paciente sobre su consumo diario actual: desayuno, almuerzo, cena y meriendas
- El término "dieta" se refiere al consumo diario general, no necesariamente a algo bueno o malo
- La nutricionista analiza toda la información y genera una dieta personalizada
- La dieta se genera en formato PDF con todas las comidas diarias (desayuno, almuerzo, cena y meriendas)
- Un paciente puede tener varias dietas asignadas
- Caso de uso discutido: **gestionar dieta** (tanto para el consumo reportado por el paciente como para la dieta generada por la nutricionista)

## Seguimiento y Monitoreo de Composición Corporal

- El paciente debe agendar citas cada ciertos días (no diariamente) para seguimiento
- En cada consulta de seguimiento se vuelven a tomar medidas
- Se monitorean múltiples indicadores:
  - **IMC (Índice de Masa Corporal)**: calculado con altura dividido entre peso al cuadrado, variable según el peso
  - **Grasa corporal y grasa visceral**
  - **Porcentaje de agua**
  - **Masa ósea** (representa 5-10% del peso total, aproximadamente 10-15 kilos)
  - **Masa muscular**
  - **Circunferencias corporales** para ver si disminuyen o aumentan
- Caso de uso identificado: **monitoreo de composición corporal**
- Se genera una gráfica mostrando la evolución de estos indicadores

## Generación y Entrega de Reportes

- El sistema debe generar PDFs automáticamente (tanto de dietas como de gráficas de seguimiento)
- Los PDFs se envían al cliente automáticamente sin intervención manual de la nutricionista
- Caso de uso: **creación/entrega de PDF**

## Arquitectura y Tecnología

- Todo el sistema debe estar desarrollado en GraphQL
- Se identificó que con la configuración actual, el sistema solo funciona para una nutricionista
- Si lo usan dos o más nutricionistas, se mezclarían pacientes, citas y dietas

## Modelo de Negocio: SaaS vs Sistema Individual

**Opción SaaS discutida:**

- Requiere implementar **pago por planes** para cada nutricionista
- Necesita **integración de pasarela de pago**
- Requiere una **landing page** descriptiva
- Implica **segmentación por planes**
- Cada paciente estaría vinculado a un usuario específico (nutricionista)
- Complejidad técnica: asegurar cada endpoint en cada microservicio para mantener datos aislados
- La complejidad estaría más en producción que en desarrollo

**Consideración de blockchain:**

- Se mencionó la posibilidad de usar blockchain para bitácora/auditorías de modificaciones y transacciones
- También se consideró para la pasarela de pago

## Decisiones

- el sistema será SaaS (multi-tenant)
- integrar blockchain
- se implementará la pasarela de pago y se usara blockchain para la bitácora/auditorías de modificaciones y transacciones

## Conclusión

El equipo definió que el **sistema central (core)** incluye: gestión de citas, medidas corporales, dietas, seguimiento/monitoreo de composición corporal y generación de PDFs   . El objetivo principal es facilitar el trabajo de los nutricionistas y guardar información relevante de cada cita, dieta y medidas del paciente .
