# Reglas del examen

Este documento funciona como checklist de cumplimiento de los requisitos del examen para el proyecto VitalBite.

| Requisito | Cumplimiento en VitalBite |
|---|---|
| Mínimo 3 microservicios | Se definen 4 microservicios: Core NestJS, Documental Spring Boot, IA/ML/DL FastAPI y Pagos .NET. |
| Microservicios desplegados en nubes diferentes | Core en AWS, Documental en Google Cloud, IA/ML/DL en Digital Ocean y Pagos en Azure. |
| Web desarrollada en Angular | La aplicación web administrativa será Angular para nutricionistas y administradores. |
| Mobile desarrollada en React Native | La app móvil será React Native para pacientes. |
| Comunicación mediante GraphQL | El Core NestJS expone GraphQL como comunicación principal para Angular y React Native. |
| No usar REST como comunicación principal | REST solo se permite como integración especializada con servicios secundarios; GraphQL sigue siendo el canal principal. |
| Base de datos principal PostgreSQL | PostgreSQL/Supabase será la base transaccional principal del Core empresarial. |
| Base de datos secundaria DynamoDB | DynamoDB se usará como base secundaria del sistema y store principal del microservicio .NET para pagos, planes, suscripciones, BI, eventos y métricas. |
| Gestión documental y almacenamiento de archivos S3 | El servicio Documental Spring Boot gestionará PDFs, reportes y archivos almacenados en Amazon S3. |
| App móvil con componentes nativos | React Native usará cámara, huella/autenticación biométrica y notificaciones push. |
| Uso de cámara o huella | La cámara se usará para capturar etiquetas o alimentos; la huella/autenticación biométrica para acceso seguro. |
| Deep Learning aplicado a imágenes | FastAPI procesará imágenes para OCR de etiquetas nutricionales y análisis visual de alimentos. |
| Machine Learning con Random Forest | FastAPI usará Random Forest para predicción de riesgo nutricional. |
| Machine Learning con K-means | FastAPI usará K-means para segmentación de pacientes. |
| Dashboard de inteligencia de negocio | Angular mostrará un dashboard BI con métricas desde Core y DynamoDB. |
| Blockchain mínimo a nivel de registro | El servicio Documental registrará hashes o eventos críticos para bitácora, auditoría y trazabilidad. |
| Automatización con n8n en tres pasos | Flujo definido: WhatsApp → Core/Sistema → Email o notificación. |

## Reglas técnicas obligatorias

- GraphQL es la comunicación principal del sistema.
- PostgreSQL/Supabase es la base de datos principal del Core empresarial.
- DynamoDB es base secundaria del sistema y base principal del dominio de pagos, suscripciones, planes SaaS, analítica, eventos y BI.
- Amazon S3 es almacenamiento de objetos, no base de datos.
- El sistema mantiene separación por microservicios y responsabilidades.
- La arquitectura debe poder explicarse como multi-cloud.
- IA, ML, BI, blockchain y n8n deben aparecer integrados al flujo empresarial, no como elementos aislados.

## Evidencia documental

- La visión general describe el alcance SaaS, actores y capacidades globales.
- La arquitectura general explica microservicios, nubes, datos, almacenamiento y comunicación.
- Las decisiones técnicas justifican cada tecnología elegida.
- Los módulos core muestran actores, datos y microservicios responsables.
- Este checklist valida el cumplimiento directo de cada requisito del examen.
