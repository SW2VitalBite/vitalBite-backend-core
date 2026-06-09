# Arquitectura general

El sistema se organiza en una arquitectura basada en microservicios, con despliegue multi-cloud y comunicación principal mediante GraphQL. Cada microservicio tiene una responsabilidad empresarial clara para facilitar escalabilidad, separación de responsabilidades y defensa académica del diseño.

## Aplicaciones cliente

### Web Angular

Aplicación para nutricionistas y administradores.

Responsabilidades:

- Gestionar pacientes, citas, medidas corporales y dietas.
- Consultar dietocálculo / cálculo nutricional de planes alimenticios.
- Administrar catálogo de alimentos, recetas y plantillas de dietas reutilizables.
- Revisar seguimiento diario, adherencia y evolución antropométrica.
- Generar y consultar reportes nutricionales.
- Administrar usuarios, roles, planes SaaS y pagos.
- Visualizar dashboard administrativo y BI.
- Consultar bitácora, auditoría y registros blockchain.

### Mobile React Native

Aplicación para pacientes.

Responsabilidades:

- Consultar dieta asignada y progreso nutricional.
- Consultar, confirmar o solicitar citas.
- Registrar seguimiento diario del paciente.
- Subir fotos de alimentos o información desde el celular.
- Registrar actividad física, estado de ánimo, metas y adherencia.
- Usar cámara para etiquetas nutricionales o fotografías de alimentos.
- Usar huella/autenticación biométrica y notificaciones push.

## Microservicios backend

| Microservicio | Tecnología | Nube sugerida | Responsabilidad principal |
|---|---|---|---|
| Core empresarial | NestJS + GraphQL | AWS | Usuarios, roles, tenants, pacientes, citas, medidas, dietas, catálogo nutricional, seguimiento, orquestación y BI |
| Documental y auditoría | Spring Boot | Google Cloud | PDFs, reportes, gestión documental, almacenamiento S3, bitácora y blockchain |
| IA / ML / DL | FastAPI | Digital Ocean | OCR, Deep Learning, Random Forest, K-means y procesamiento de imágenes |
| Pagos y suscripciones | .NET / C# | Azure | Planes SaaS, pagos, facturación, renovaciones, DynamoDB y eventos financieros |

## Core empresarial: NestJS + GraphQL

Es el servicio central del sistema y expone la API GraphQL consumida por Angular y React Native.

Responsabilidades:

- Autenticación, autorización, roles y multi-tenant.
- Gestión de pacientes, citas, medidas corporales, dietas y seguimiento.
- Gestión de dietocálculo / cálculo nutricional, catálogo de alimentos y recetas, plantillas de dietas reutilizables y seguimiento diario del paciente.
- Registro de datos para somatocarta / antropometría avanzada.
- Consulta de indicadores BI generados desde eventos y métricas.
- Orquestación con Documental, IA/ML/DL y Pagos.
- Publicación de datos necesarios para dashboard web y app móvil.

## Documental y auditoría: Spring Boot

Servicio especializado en documentos, reportes y trazabilidad.

Responsabilidades:

- Generar PDFs de dietas, fichas de pacientes y reportes nutricionales.
- Gestionar metadatos documentales.
- Escribir y leer objetos en Amazon S3 mediante URLs prefirmadas.
- Registrar bitácora de accesos, cambios críticos y eventos financieros.
- Mantener hashes o registros blockchain para auditoría e integridad.

## IA / ML / DL: FastAPI

Servicio especializado en inteligencia artificial y Machine Learning.

Responsabilidades:

- Procesar imágenes capturadas desde la app móvil.
- Aplicar Deep Learning/OCR para leer etiquetas nutricionales.
- Apoyar el análisis visual de alimentos registrados por pacientes.
- Usar Random Forest para predecir riesgo nutricional.
- Usar K-means para segmentar pacientes por patrones.
- Entregar resultados al Core para consulta desde GraphQL o dashboard BI.

## Pagos y suscripciones: .NET

Servicio especializado en modelo SaaS y ciclo financiero.

Responsabilidades:

- Gestionar planes, precios, suscripciones y renovaciones.
- Procesar pagos y facturación.
- Persistir planes SaaS, pagos, facturas, renovaciones, límites y estados de suscripción en DynamoDB.
- Notificar al Core cambios de estado de suscripción.
- Notificar al servicio Documental eventos financieros auditables.

### Implementacion V1

El primer corte de pagos y suscripciones se implementa en el repositorio hermano
`vitalBite-backend-payments-dotnet`.

- Expone catalogo de planes, compra inicial y estado de suscripcion.
- Usa DynamoDB Local con tabla unica `VitalBitePayments`.
- Mantiene dos planes mensuales: `Nutricionista individual` por 15 USD y `Clinica completa` por 30 USD.
- Usa Stripe Checkout en modo test para la compra inicial.
- Genera factura PDF y trazabilidad auditable al confirmar el pago.
- El Core consulta este servicio y expone la informacion a Angular mediante GraphQL.

### Flujo de activacion comercial

Un tenant nuevo crea su cuenta profesional y luego pasa por una pantalla de activacion comercial. Si no tiene suscripcion activa, solo puede elegir un plan y completar la compra inicial. Una vez confirmada, el sistema habilita el panel principal.

El rol `SUPER_ADMIN` sigue disponible para gestion global de tenants, auditoria y solicitudes de cambio de plan entre clinicas.

## Comunicación

La comunicación principal del sistema será GraphQL a través del Core NestJS. Los clientes web y móvil consumen el Core para las operaciones empresariales.

Las integraciones REST pueden existir únicamente como comunicación especializada con servicios de documentos, IA/ML/DL o pagos. Estas integraciones no reemplazan GraphQL como mecanismo principal del sistema.

Flujo base:

1. Angular consulta el Core mediante GraphQL para pacientes, dietas, catálogo nutricional, seguimiento, medidas y dashboard BI.
2. React Native consulta y registra mediante GraphQL dietas, citas, progreso y seguimiento diario del paciente.
3. El Core resuelve datos transaccionales empresariales desde PostgreSQL/Supabase.
4. El Core invoca FastAPI cuando necesita OCR, análisis visual de alimentos, Random Forest o K-means.
5. El Core consulta al microservicio .NET para validar estado de suscripción, plan y límites del tenant.
6. El microservicio .NET persiste pagos, planes, facturas y suscripciones en DynamoDB.
7. El Core consulta o envía eventos a DynamoDB para BI, métricas e indicadores financieros.
8. El Core invoca servicios especializados cuando necesita PDF, IA/ML/DL o estado financiero.
9. El servicio Documental genera URLs prefirmadas de S3 para descarga de archivos.

## Datos y almacenamiento

| Recurso | Tipo | Uso dentro del sistema |
|---|---|---|
| PostgreSQL/Supabase | Base principal relacional del Core | Usuarios, tenants, pacientes, citas, medidas, dietas, catálogo nutricional, plantillas, seguimiento y documentos como metadatos |
| DynamoDB | Base secundaria NoSQL del sistema y principal de Pagos .NET | Planes SaaS, pagos, facturas, renovaciones, estados de suscripción, límites por tenant, eventos BI, métricas de alto volumen, tendencias, adherencia e indicadores financieros |
| Amazon S3 | Almacenamiento de objetos | PDFs, reportes, imágenes OCR temporales y documentos generados |

S3 no reemplaza a PostgreSQL ni a DynamoDB; se usa como almacenamiento documental y de archivos. PostgreSQL/Supabase conserva el Core empresarial y DynamoDB conserva el dominio financiero del microservicio .NET junto con datos analíticos.

## Automatización

n8n se usará para automatizar un flujo de tres pasos:

1. **WhatsApp:** recibe o dispara una solicitud relacionada con citas o notificaciones.
2. **Sistema/Core:** consulta o registra información en el Core mediante el flujo empresarial.
3. **Email o notificación:** envía confirmación, recordatorio o aviso al paciente/nutricionista.
