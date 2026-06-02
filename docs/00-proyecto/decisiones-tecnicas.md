# Decisiones técnicas

Este documento registra las decisiones principales del proyecto y su justificación para mantener consistencia entre arquitectura, reglas del examen y alcance académico.

## Dominio del sistema

Se trabaja sobre el dominio de nutrición y salud porque permite cubrir procesos empresariales reales: gestión de pacientes, citas, seguimiento corporal, planes alimenticios, reportes, pagos, inteligencia de negocio y auditoría.

## Tipo de sistema

El sistema será una plataforma SaaS para consultorios y profesionales de nutrición.

Justificación:

- Permite manejar múltiples nutricionistas o consultorios mediante tenants.
- Habilita planes de suscripción y facturación.
- Facilita dashboard administrativo y análisis de negocio.

## Aplicación web

La web será desarrollada en Angular y estará orientada a nutricionistas y administradores.

Justificación:

- Angular es adecuado para paneles administrativos empresariales.
- Permite organizar módulos, rutas, formularios y dashboards.
- Facilita la gestión de pacientes, citas, dietas, pagos, BI y auditoría desde un entorno web.

## Aplicación móvil

La app móvil será desarrollada en React Native y estará orientada a pacientes.

Justificación:

- Permite usar componentes nativos como cámara, huella/autenticación biométrica y notificaciones.
- Permite al paciente consultar su dieta, citas y progreso desde el celular.
- Facilita la captura de imágenes para análisis nutricional mediante IA.

## Comunicación principal

Se usará GraphQL como mecanismo principal de comunicación del sistema a través del Core NestJS.

Justificación:

- Los clientes pueden solicitar exactamente los datos que necesitan.
- Es conveniente para vistas con información combinada de pacientes, citas, medidas, dietas y progreso.
- Mantiene un contrato central para Angular y React Native.

REST solo se permitirá como integración especializada con servicios secundarios, por ejemplo Documental, IA/ML/DL o Pagos. Esta decisión no reemplaza GraphQL como comunicación principal.

## Microservicios y nubes

Se decidió dividir el backend en cuatro microservicios para cumplir separación de responsabilidades y despliegue multi-cloud.

| Microservicio | Tecnología | Nube | Justificación |
|---|---|---|---|
| Core empresarial | NestJS + GraphQL | AWS | Centraliza procesos principales y GraphQL |
| Documental y auditoría | Spring Boot | Google Cloud | Gestiona PDFs, archivos, auditoría y blockchain |
| IA / ML / DL | FastAPI | Digital Ocean | Ejecuta modelos, OCR y procesamiento de imágenes |
| Pagos y suscripciones | .NET / C# | Azure | Gestiona pagos, facturación y planes SaaS |

## Base de datos y almacenamiento

Se usará PostgreSQL/Supabase como base de datos principal del Core empresarial y DynamoDB como base secundaria del sistema. Dentro de esa distribución, DynamoDB será el store principal del microservicio .NET de pagos, suscripciones y planes SaaS.

Justificación:

- **PostgreSQL/Supabase:** almacena información transaccional y relacional del Core: usuarios, tenants, pacientes, citas, medidas, dietas, seguimiento y metadatos documentales.
- **DynamoDB:** almacena planes SaaS, pagos, facturas, renovaciones, estados de suscripción, límites por tenant, eventos, métricas, resultados analíticos y datos de BI.
- **Amazon S3:** almacena PDFs, documentos generados e imágenes temporales para OCR.

PostgreSQL y DynamoDB no son alternativas excluyentes. PostgreSQL es la base principal del Core empresarial, mientras que DynamoDB es la base principal del dominio financiero gestionado por .NET y complementa los casos analíticos o de alto volumen.

La elección de DynamoDB para pagos y suscripciones permite consultas rápidas por tenant, estado de suscripción, plan activo, facturas y eventos de renovación, además de escalar registros financieros y métricas sin acoplarlos al modelo relacional del Core.

## Inteligencia artificial y Deep Learning

Se usará IA aplicada a imágenes capturadas desde la app móvil.

Caso principal:

- Lectura de etiquetas nutricionales mediante OCR y Deep Learning.
- Extracción de calorías, macronutrientes, ingredientes y datos relevantes.
- Apoyo al paciente para validar alimentos contra restricciones o recomendaciones.

## Machine Learning

Se usarán modelos supervisados y no supervisados dentro del microservicio FastAPI.

### Random Forest

Uso definido:

- Predicción de riesgo nutricional del paciente.

Datos de entrada esperados:

- Edad, peso, IMC, historial de medidas, hábitos, cumplimiento de dieta, antecedentes y citas.

Resultado esperado:

- Nivel o score de riesgo nutricional para mostrar en dashboard y seguimiento.

### K-means

Uso definido:

- Segmentación de pacientes por patrones nutricionales y corporales.

Datos de entrada esperados:

- Evolución de medidas, composición corporal, hábitos, adherencia y objetivos nutricionales.

Resultado esperado:

- Cluster o grupo de pacientes con características similares para análisis BI y recomendaciones.

## Dashboard BI

El dashboard BI será parte del panel web y se alimentará de información del Core y de métricas almacenadas en DynamoDB.

Indicadores esperados:

- Pacientes activos.
- Citas realizadas y canceladas.
- Cumplimiento de dietas.
- Evolución promedio de pacientes.
- Ingresos por suscripción.
- Riesgo nutricional por paciente o grupo.
- Segmentación K-means.

## Blockchain

Se usará blockchain a nivel de registro, auditoría y trazabilidad desde el microservicio Documental.

Eventos auditables:

- Accesos a documentos.
- Cambios críticos en pacientes, citas o dietas.
- Generación de reportes.
- Pagos y renovaciones notificados por el servicio .NET.
- Cambios de estado de suscripción.

La finalidad no es implementar una criptomoneda, sino garantizar integridad e inmutabilidad de eventos importantes.

## Automatización con n8n

Se usará n8n para un flujo de tres pasos:

1. **WhatsApp:** paciente solicita, confirma o recibe recordatorio.
2. **Sistema/Core:** se consulta o registra información relacionada con citas/notificaciones.
3. **Email o notificación:** se envía confirmación al paciente o aviso al nutricionista.

Esta automatización complementa la operación del sistema y demuestra integración con herramientas externas.
