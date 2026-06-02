# Visión general del proyecto

VitalBite es una plataforma empresarial SaaS de nutrición y salud orientada a consultorios, nutricionistas, administradores y pacientes. El sistema permite gestionar pacientes, citas, medidas corporales, planes alimenticios, seguimiento nutricional, reportes, pagos, suscripciones, inteligencia de negocio y auditoría.

La propuesta principal es centralizar el trabajo operativo del nutricionista y, al mismo tiempo, entregar al paciente una aplicación móvil para consultar su plan, registrar información, confirmar citas y usar capacidades nativas del dispositivo.

## Actores principales

- **Administrador:** gestiona usuarios, roles, tenants, planes SaaS, pagos, dashboard BI y auditoría.
- **Nutricionista:** registra pacientes, agenda citas, toma medidas, crea dietas, revisa progreso y genera reportes.
- **Paciente:** consulta dietas, revisa citas, confirma asistencia, visualiza progreso y sube información desde la app móvil.

## Canales del sistema

- **Aplicación web Angular:** panel administrativo para nutricionistas y administradores.
- **Aplicación móvil React Native:** app para pacientes con cámara, autenticación biométrica, notificaciones y carga de imágenes.
- **Backend por microservicios:** servicios independientes desplegados en diferentes nubes.

## Capacidades empresariales

El sistema cubre los módulos core del negocio: usuarios y roles, pacientes, citas, medidas corporales, seguimiento nutricional, dietas, documentos, reportes, pagos, suscripciones, dashboard BI y auditoría.

Además de la gestión empresarial básica, VitalBite incorpora:

- **GraphQL** como comunicación principal entre clientes y Core.
- **PostgreSQL/Supabase** como base de datos transaccional principal del Core empresarial.
- **DynamoDB** como base secundaria del sistema y store principal del microservicio .NET para pagos, planes, suscripciones, eventos, métricas y BI.
- **Amazon S3** para almacenamiento de PDFs, documentos e imágenes temporales.
- **Deep Learning** para lectura de etiquetas nutricionales y procesamiento de imágenes.
- **Random Forest** para predicción de riesgo nutricional.
- **K-means** para segmentación de pacientes.
- **Dashboard BI** para indicadores administrativos y nutricionales.
- **Blockchain** para bitácora, auditoría y trazabilidad de eventos críticos.
- **n8n** para automatización de procesos como WhatsApp → Sistema/Core → Email o notificación.

## Enfoque arquitectónico

VitalBite se organiza como una arquitectura multi-cloud basada en microservicios. El Core empresarial se implementa con NestJS y GraphQL, el servicio documental con Spring Boot, el servicio de IA/ML/DL con FastAPI y el servicio de pagos con .NET.

La comunicación principal hacia el sistema será GraphQL. Las integraciones REST solo se consideran para servicios especializados, como generación documental, análisis de imágenes o pagos, sin reemplazar a GraphQL como canal principal del Core.
