# Resumen Completo de la Documentación - VitalBite

**Fecha:** 3 de junio de 2026  
**Proyecto:** VitalBite - Plataforma SaaS de Nutrición y Salud

---

## Tabla de Contenidos

1. [Visión General del Proyecto](#visión-general-del-proyecto)
2. [Arquitectura del Sistema](#arquitectura-del-sistema)
3. [Decisiones Técnicas](#decisiones-técnicas)
4. [Módulos Core Empresariales](#módulos-core-empresariales)
5. [Especificación de Requisitos PUDS](#especificación-de-requisitos-puds)
6. [Microservicio NestJS - Core Empresarial](#microservicio-nestjs---core-empresarial)
7. [Aplicación Web Angular](#aplicación-web-angular)
8. [Reglas de Examen](#reglas-de-examen)

---

## Visión General del Proyecto

### Descripción
VitalBite es una plataforma empresarial **SaaS** de nutrición y salud orientada a consultorios, nutricionistas, administradores y pacientes. Centraliza la operación del nutricionista y entrega al paciente una aplicación móvil para consultar su plan, registrar información y usar capacidades nativas del dispositivo.

### Actores Principales
- **Administrador:** Gestiona usuarios, roles, tenants, planes SaaS, pagos, dashboard BI y auditoría.
- **Nutricionista:** Registra pacientes, agenda citas, toma medidas, crea dietas y revisa progreso.
- **Paciente:** Consulta dietas, revisa citas, confirma asistencia y registra seguimiento desde la app móvil.

### Canales del Sistema
- **Aplicación Web Angular:** Panel administrativo para nutricionistas y administradores.
- **Aplicación Móvil React Native:** App para pacientes con cámara, autenticación biométrica y notificaciones.
- **Backend por Microservicios:** Servicios independientes desplegados en diferentes nubes.

### Capacidades Empresariales
El sistema cubre: gestión de usuarios y roles, pacientes, citas, medidas corporales, seguimiento nutricional, dietas, documentos, reportes, pagos, suscripciones, dashboard BI y auditoría.

**Capacidades adicionales:**
- GraphQL como comunicación principal
- PostgreSQL/Supabase como base de datos transaccional
- DynamoDB como base secundaria del sistema
- Amazon S3 para almacenamiento de PDFs y documentos
- Dietocálculo y cálculo nutricional
- Catálogo de alimentos y recetas
- Plantillas de dietas reutilizables
- Seguimiento diario del paciente
- Somatocarta y antropometría avanzada
- Deep Learning para lectura de etiquetas
- Random Forest para predicción de riesgo
- K-means para segmentación de pacientes
- Dashboard BI
- Blockchain para bitácora y auditoría
- n8n para automatización de procesos

---

## Arquitectura del Sistema

### Aplicaciones Cliente

#### Web Angular
- **Usuarios:** Nutricionistas y administradores
- **Responsabilidades:**
  - Gestionar pacientes, citas, medidas corporales y dietas
  - Consultar dietocálculo
  - Administrar catálogo de alimentos y recetas
  - Revisar seguimiento y evolución antropométrica
  - Generar y consultar reportes nutricionales
  - Administrar usuarios, roles y planes SaaS
  - Visualizar dashboard administrativo y BI

#### Mobile React Native
- **Usuarios:** Pacientes
- **Responsabilidades:**
  - Consultar dieta asignada y progreso nutricional
  - Gestionar citas
  - Registrar seguimiento diario
  - Usar cámara para análisis nutricional
  - Autenticación biométrica
  - Notificaciones push

### Microservicios Backend

| Microservicio | Tecnología | Nube | Responsabilidad |
|---|---|---|---|
| Core Empresarial | NestJS + GraphQL | AWS | Usuarios, roles, tenants, pacientes, citas, medidas, dietas, seguimiento |
| Documental y Auditoría | Spring Boot | Google Cloud | PDFs, reportes, auditoría, blockchain, S3 |
| IA / ML / DL | FastAPI | Digital Ocean | OCR, Deep Learning, Random Forest, K-means |
| Pagos y Suscripciones | .NET / C# | Azure | Planes SaaS, pagos, facturación, DynamoDB |

### Core Empresarial: NestJS + GraphQL
**Responsabilidades:**
- Autenticación, autorización, roles y multi-tenant
- Gestión de pacientes, citas, medidas y dietas
- Gestión de dietocálculo y catálogo nutricional
- Registro de antropometría avanzada
- Consulta de indicadores BI
- Orquestación con otros microservicios
- Publicación de datos para dashboard y app móvil

### Comunicación
GraphQL es el mecanismo principal entre clientes y Core. REST solo se permite como integración especializada con servicios secundarios.

---

## Decisiones Técnicas

### Dominio del Sistema
Se eligió nutrición y salud por permitir cubrir procesos empresariales reales: gestión de pacientes, citas, seguimiento corporal, planes alimenticios, reportes, pagos y auditoría. El dominio nutricional operativo se fortalece con dietocálculo, catálogo de alimentos y antropometría avanzada.

### Tipo de Sistema
Plataforma SaaS para consultorios y profesionales de nutrición, permitiendo:
- Manejo de múltiples nutricionistas mediante tenants
- Planes de suscripción y facturación
- Dashboard administrativo y análisis de negocio

### Aplicación Web
**Angular** para panel administrativo empresarial con gestión de pacientes, citas, dietas, pagos, BI y auditoría.

### Aplicación Móvil
**React Native** para pacientes, permitiendo componentes nativos (cámara, huella, notificaciones) y captura de información.

### Comunicación Principal
**GraphQL** permite a clientes solicitar exactamente los datos necesarios. Conveniente para vistas combinadas. Mantiene contrato central para Angular y React Native.

### Microservicios y Nubes
Separación por responsabilidades y despliegue multi-cloud:
- Core en AWS
- Documental en Google Cloud
- IA/ML/DL en Digital Ocean
- Pagos en Azure

### Base de Datos y Almacenamiento
- **PostgreSQL/Supabase:** Información transaccional y relacional del Core
- **DynamoDB:** Planes SaaS, pagos, facturas, eventos y BI
- **Amazon S3:** PDFs, documentos e imágenes temporales

### Capacidades Nutricionales del Core
- Dietocálculo/cálculo nutricional
- Catálogo de alimentos y recetas
- Plantillas de dietas reutilizables
- Seguimiento diario del paciente
- Somatocarta/antropometría avanzada

Estas capacidades aumentan la utilidad clínica y evitan que el sistema sea solo administrativo.

---

## Módulos Core Empresariales

### 1. Gestión de Usuarios y Roles
- **Actor:** Administrador
- **Responsabilidades:** Usuarios, credenciales, roles, permisos y multi-tenant
- **Base de datos:** PostgreSQL/Supabase
- **Roles principales:** Administrador, Nutricionista, Paciente

### 2. Gestión de Pacientes
- **Actor:** Nutricionista
- **Responsabilidades:** Registro, actualización y consulta de información clínica
- **Datos:** Personales, antecedentes, objetivos nutricionales, estado
- **Base de datos:** PostgreSQL/Supabase

### 3. Gestión de Citas
- **Actores:** Nutricionista y Paciente
- **Responsabilidades:** Agendar, confirmar, reprogramar y cancelar citas
- **Datos:** Fecha, hora, paciente, nutricionista, estado, motivo
- **Operaciones:** Agendar, confirmar, reprogramar, cancelar, consultar calendario

### 4. Gestión de Medidas Corporales
- **Actor:** Nutricionista
- **Responsabilidades:** Registrar evolución física y nutricional
- **Datos:** Peso, talla, IMC, perímetros, pliegues, diámetros, grasa, masa muscular, agua, bioimpedancia, somatotipo
- **Relaciones:** Alimenta seguimiento, reportes, ML y BI

### 5. Seguimiento Nutricional
- **Actores:** Nutricionista y Paciente
- **Responsabilidades:** Controlar evolución del paciente
- **Datos:** Progreso, cumplimiento, observaciones, alertas, fotos, actividad, estado de ánimo, metas
- **Gráficos:** Evolución y comparación histórica

### 6. Gestión de Dietas
- **Actor:** Nutricionista
- **Responsabilidades:** Crear y asignar planes alimenticios personalizados
- **Datos:** Plan, comidas, alimentos, recetas, porciones, restricciones, objetivo, vigencia, calorías, macronutrientes
- **Operaciones:** Crear, actualizar, asignar, generar PDF

### 7. Catálogo Nutricional
- **Actores:** Nutricionista, Administrador
- **Responsabilidades:** Registrar alimentos, recetas y preparaciones reutilizables
- **Datos:** Alimento, receta, porción base, grupo alimenticio, valores nutricionales
- **Regla:** Separación por tenant

### 8. Plantillas de Dietas
- **Actor:** Nutricionista
- **Responsabilidades:** Crear planes base reutilizables y adaptables
- **Datos:** Plantilla, objetivo, comidas base, ítems base, recetas, vigencia
- **Regla:** No reemplaza dieta asignada; genera registro independiente

### 9. Dietocálculo
- **Actor:** Nutricionista
- **Responsabilidades:** Calcular aporte nutricional de dietas, comidas y recetas
- **Datos:** Calorías, proteínas, carbohidratos, grasas, micronutrientes
- **Ubicación:** Core NestJS (no FastAPI)

### 10. Antropometría Avanzada
- **Actor:** Nutricionista
- **Responsabilidades:** Complementar medidas corporales con pliegues, diámetros, somatotipo y somatocarta
- **Cálculo:** Formula Heath-Carter para somatotipo
- **Campos mínimos:** Peso, talla, pliegues corporales, perímetros, diámetros

### 11. Seguimiento Diario
- **Actores:** Paciente (principalmente), Nutricionista (consulta)
- **Responsabilidades:** Registrar información diaria desde app móvil
- **Datos:** Adherencia, fotos de alimentos, actividad física, estado de ánimo, metas
- **Flujo de fotos:** URL prefirmada → Sube a S3 → Asocia metadato

---

## Especificación de Requisitos PUDS

### Identificación de Actores
- **A1: Paciente** - App móvil React Native
- **A2: Nutricionista** - Web Angular
- **A3: Super Administrador** - Web Angular con privilegios absolutos

### Matriz de Casos de Uso Principales

#### Ciclo 1: Capa Transaccional y Core Multi-Tenant
| ID | Caso de Uso | Prioridad | Actores | Canal | Componente |
|---|---|---|---|---|---|
| CU1 | Gestionar Expediente de Pacientes | Alta | A2 | Web | Core NestJS + PostgreSQL |
| CU2 | Gestionar Control de Citas | Alta | A1, A2 | Web/Móvil | Core NestJS + PostgreSQL |
| CU3 | Registrar Medidas Corporales | Alta | A2 | Web | Core NestJS + PostgreSQL |
| CU4 | Diseñar y Asignar Planes Dietéticos | Alta | A2 | Web | Core NestJS + PostgreSQL |
| CU5 | Consultar Plan Alimenticio | Alta | A1 | Móvil | Core NestJS GraphQL |
| CU6 | Autenticación Multi-Tenant | Alta | A1, A2, A3 | Web/Móvil | Core NestJS + JWT |

#### Ciclo 2: Capacidades Avanzadas
| ID | Caso de Uso | Prioridad | Actores | Canal | Componente |
|---|---|---|---|---|---|
| CU7 | Monitorear Evolución y BI | Alta | A1, A2, A3 | Web/Móvil | Core + .NET + DynamoDB |
| CU8 | Generar Reporte PDF | Media | A2 | Web | Spring Boot + S3 |
| CU9 | Analizar Etiquetas con DL | Media | A1 | Móvil | FastAPI OCR |
| CU10 | Predicción de Riesgo | Media | A2 | Web | FastAPI Random Forest |
| CU11 | Segmentación de Perfiles | Media | A2 | Web | FastAPI K-means |
| CU12 | Automatizar Flujos | Media | A1, A2 | Externo | n8n |
| CU13 | Auditar Eventos | Media | A3 | Web | Spring Boot + Blockchain |
| CU14 | Gestionar Planes SaaS | Media | A3 | Web | .NET + DynamoDB |
| CU15 | Conciliar Pagos | Media | A3 | Web | .NET + DynamoDB |

### Especificación Detallada de Casos de Uso

#### CU1: Gestionar Expediente de Pacientes
- **Propósito:** Permitir nutricionista administrar información clínica de pacientes
- **Precondición:** Nutricionista autenticado con Tenant ID válido
- **Flujo:** Nutricionista → Módulo Pacientes → Crear Ficha → Llenar formulario → Guardar Expediente
- **Validaciones:** Consistencia de datos, aislamiento tenant
- **Postcondición:** Expediente registrado en PostgreSQL bajo aislamiento multi-tenant

#### CU2: Gestionar Control de Citas
- **Propósito:** Administrar programación, reserva y confirmación de citas
- **Actores:** Paciente o Nutricionista
- **Precondición:** Paciente existe, consultorio tiene jornada disponible
- **Flujo:** Acceder a Citas → Seleccionar fecha/hora → Confirmar → Sistema valida en tiempo real
- **Validación:** Confirmación de disponibilidad sin conflictos concurrentes
- **Postcondición:** Cita agendada en PostgreSQL, alertas enviadas

#### CU3: Registrar Medidas Corporales
- **Propósito:** Capturar parámetros físicos y antropométricos
- **Precondición:** Paciente tiene expediente clínico activo
- **Flujo:** Nutricionista → Perfil Paciente → Registrar Medidas → Ingresar valores → Guardar
- **Cálculos automáticos:** IMC, porcentaje grasa corporal
- **Postcondición:** Métricas guardadas cronológicamente para análisis y BI

#### CU4: Diseñar y Asignar Planes Dietéticos
- **Propósito:** Estructurar planes nutricionales personalizados
- **Precondición:** Nutricionista con permisos de escritura
- **Flujo:** Crear dieta → Definir menús → Asignar alimentos → Calcular nutrientes → Guardar/Asignar
- **Capacidades:** Usar plantillas, consultar dietocálculo, generar PDF
- **Postcondición:** Dieta guardada con snapshot nutricional

#### CU5: Consultar Plan Alimenticio
- **Propósito:** Permitir paciente consultar su plan desde app móvil
- **Precondición:** Dieta asignada al paciente
- **Flujo:** Paciente abre app → Consulta Plan → Sistema devuelve dieta actual
- **Datos mostrados:** Comidas, alimentos, porciones, objetivo, vigencia

#### CU6: Autenticación Multi-Tenant
- **Propósito:** Validar identidad y autorizar acceso según rol
- **Flujo:** Login → Validar credenciales → Generar JWT → Cliente almacena token → Usa en requests
- **Validaciones:** JWT, rol, permisos, tenant_id

---

## Microservicio NestJS - Core Empresarial

### Objetivo General
Proveer API GraphQL centralizada para gestionar operaciones principales de VitalBite.

### Objetivos Funcionales
- Gestionar usuarios, roles y permisos
- Registrar y administrar pacientes
- Gestionar citas nutricionales
- Registrar medidas corporales
- Controlar seguimiento nutricional
- Crear y asignar dietas
- Consultar datos para dashboard y reportes

### Objetivos Técnicos
- Usar GraphQL como comunicación principal
- Arquitectura modular por dominio
- Persistir datos transaccionales en PostgreSQL/Supabase
- Aplicar autenticación JWT y autorización por roles
- Soportar separación multi-tenant mediante tenant_id
- Orquestar servicios externos

### Responsabilidades por Módulo

| Módulo | Responsabilidad |
|---|---|
| Usuarios y roles | Control de acceso y permisos |
| Pacientes | CRUD de pacientes |
| Citas | Agenda y gestión de citas |
| Medidas corporales | Registro de evolución física |
| Seguimiento nutricional | Control de progreso |
| Dietas | Creación y asignación de planes |
| Dietocálculo | Cálculo nutricional |
| Catálogo nutricional | Gestión de alimentos y recetas |
| Plantillas de dietas | Planes base reutilizables |
| Seguimiento diario | Registro diario del paciente |
| Antropometría avanzada | Pliegues, diámetros, somatotipo |

### Fuera de Alcance del Core
- Pagos y suscripciones: .NET y DynamoDB
- Documentos, PDFs, S3 y blockchain: Spring Boot
- OCR, análisis de imágenes, Random Forest, K-means: FastAPI

### Capas Principales
- **Resolvers GraphQL:** Reciben consultas y mutaciones
- **Services:** Contienen reglas de negocio
- **Repositories/ORM:** Administran acceso a PostgreSQL
- **Guards:** Protegen rutas GraphQL mediante JWT, roles y permisos
- **DTO/Input Types:** Definen entradas de GraphQL
- **Entities/Models:** Representan tablas del dominio

### Integraciones
| Servicio | Uso |
|---|---|
| .NET Pagos | Validar plan y suscripción |
| Spring Boot Documental | Solicitar PDFs y auditoría |
| FastAPI IA/ML/DL | Consultar predicciones |
| DynamoDB | Consultar métricas y BI |

### Estructura de Carpetas
```
src/
├── app.module.ts
├── main.ts
├── config/
├── common/
│   ├── decorators/
│   ├── guards/
│   ├── interceptors/
│   └── filters/
├── auth/
├── users/
├── roles/
├── patients/
├── appointments/
├── body-measurements/
├── nutrition-tracking/
├── diets/
├── dashboard/
└── integrations/
    ├── payments/
    ├── documents/
    └── ai/
```

### Flujo General GraphQL
1. Angular o React Native envía query/mutation GraphQL
2. Resolver recibe solicitud
3. Guards validan JWT, rol, permiso y tenant_id
4. Service ejecuta reglas de negocio
5. Repository consulta o modifica PostgreSQL
6. Resolver devuelve respuesta GraphQL

### Flujo con Microservicios Externos
1. Core recibe solicitud GraphQL
2. Valida permisos y tenant
3. Consulta microservicio especializado si aplica
4. Consolida respuesta
5. Cliente recibe respuesta GraphQL uniforme

### Endpoint GraphQL
```text
/graphql
```

### Autenticación
- Método: Email y contraseña → JWT
- Header: `Authorization: Bearer <token>`
- Validación en guards antes de ejecutar resolvers protegidos

### Autorización - Niveles
- Autenticación obligatoria
- Validación de rol
- Validación de permiso
- Validación de tenant
- Validación de propiedad del recurso

### Autorización - Reglas
- **Administrador:** Gestiona usuarios, roles, dashboard
- **Nutricionista:** Gestiona pacientes asignados, citas, medidas, dietas, catálogo
- **Paciente:** Consulta información permitida de su perfil, registra seguimiento

### JWT Claims
| Claim | Descripción |
|---|---|
| sub | ID del usuario |
| email | Correo del usuario |
| role | Rol principal |
| tenant_id | Tenant al que pertenece |
| permissions | Lista de permisos |

### Permisos Sugeridos
- users:read, users:write
- patients:read, patients:write
- appointments:read, appointments:write
- measures:read, measures:write
- tracking:read, tracking:write
- diets:read, diets:write
- nutrition-catalog:read, nutrition-catalog:write
- diet-templates:read, diet-templates:write
- nutrition-calculation:read, nutrition-calculation:write
- daily-tracking:read, daily-tracking:write
- patient-goals:read, patient-goals:write
- advanced-anthropometry:read, advanced-anthropometry:write
- dashboard:read
- documents:request

### Queries GraphQL Principales
- `health` - Verificar estado del Core
- `me` - Usuario autenticado
- `patients(filter)` - Lista de pacientes
- `appointments(filter)` - Lista de citas
- `bodyMeasurementsByPatient(patientId)` - Medidas corporales
- `diets(filter)` - Lista de dietas
- `foodCatalog` - Catálogo de alimentos
- `recipes` - Lista de recetas
- `dietTemplates` - Plantillas disponibles
- `trackingByPatient(patientId)` - Seguimiento nutricional
- `dailyTrackingByPatient(patientId)` - Seguimiento diario

### Mutations GraphQL Principales
- `login(input)` - Autenticación
- `createUser(input)` - Crear usuario
- `createPatient(input)` - Registrar paciente
- `createAppointment(input)` - Agendar cita
- `createBodyMeasurement(input)` - Registrar medidas
- `createDiet(input)` - Crear dieta
- `createFoodCatalogItem(input)` - Agregar alimento
- `createRecipe(input)` - Crear receta
- `createDietTemplate(input)` - Crear plantilla
- `calculateDietNutrition(input)` - Calcular nutrientes
- `createDailyTrackingEntry(input)` - Registrar seguimiento diario
- `addDailyFoodPhoto(input)` - Agregar foto de alimento
- `createPatientGoal(input)` - Crear meta

### Resolvers Esperados
| Resolver | Módulo | Responsabilidad |
|---|---|---|
| HealthResolver | health | Verificar estado |
| TenantsResolver | tenants | Administrar tenants |
| PatientsResolver | patients | Gestionar pacientes |
| AppointmentsResolver | appointments | Gestionar citas |
| BodyMeasurementsResolver | body-measurements | Medidas corporales |
| DietsResolver | diets | Gestionar dietas |
| NutritionCatalogResolver | nutrition-catalog | Catálogo de alimentos |
| DietTemplatesResolver | diet-templates | Plantillas reutilizables |
| NutritionCalculationResolver | nutrition-calculation | Dietocálculo |
| DailyTrackingResolver | daily-tracking | Seguimiento diario |
| AdvancedAnthropometryResolver | advanced-anthropometry | Antropometría avanzada |
| ReportsResolver | reports | Reportes y documentos |

### Entidades Principales

#### Tenant
- id, name, slug, status, createdAt, updatedAt, deletedAt

#### User
- id, tenantId, roleId, email, firstName, lastName, status, role, createdAt, updatedAt, deletedAt

#### Role
- id, tenantId, name, code, permissions, createdAt, updatedAt

#### Patient
- id, tenantId, nutritionistId, firstName, lastName, email, phone, birthDate, gender, status, clinicalNotes, nutritionGoal

#### Appointment
- id, tenantId, patientId, nutritionistId, scheduledAt, durationMinutes, status, reason, observaciones

#### BodyMeasurement
- id, tenantId, patientId, measuredAt, weight, height, imc, waist, hip, registeringUser

#### Diet
- id, tenantId, patientId, nutritionistId, name, objective, vigency, status, result

#### FoodCatalogItem
- id, tenantId, name, group, portion, calories, proteins, carbs, fats, micronutrients

#### Recipe
- id, tenantId, name, portion, calories, items

#### DietTemplate
- id, tenantId, nutritionistId, name, objective, meals, items

#### NutritionCalculation
- id, dietId, totalCalories, proteins, carbs, fats, micronutrients

#### DailyTrackingEntry
- id, patientId, date, adherence, observations, foodPhotos, physicalActivity, mood, goals

#### AnthropometryMeasurement
- id, patientId, bodyMeasurementId, tricepPlicas, subscapularPlicas, suprailiaca, pantorrilla, armCirc, pantorrillaCirc, humeroDiameter, femurDiameter

#### SomatotypeResult
- id, endomorfia, mesomorfia, ectomorfia, somatocartaX, somatocartaY

### Instalación y Configuración

#### Requisitos Técnicos
- Node.js LTS
- npm o yarn
- NestJS CLI
- PostgreSQL o Supabase
- Prisma ORM
- Cliente GraphQL para pruebas
- Git

#### Instalación Base
```bash
npm install
```

#### Configuración Inicial
1. Crear archivo `.env`
2. Configurar conexión a PostgreSQL/Supabase
3. Configurar secretos JWT
4. Configurar URLs de microservicios externos
5. Agregar Prisma
6. Crear `PrismaService`
7. Ejecutar migraciones

#### Variables de Entorno
| Variable | Descripción |
|---|---|
| NODE_ENV | Entorno: development, test, production |
| PORT | Puerto HTTP del servicio |
| DATABASE_URL | URL de conexión a PostgreSQL/Supabase |
| JWT_SECRET | Secreto para firmar JWT |
| JWT_EXPIRES_IN | Tiempo de expiración del token |
| PAYMENTS_SERVICE_URL | URL del microservicio .NET |
| DOCUMENTS_SERVICE_URL | URL del microservicio Spring Boot |
| AI_SERVICE_URL | URL del microservicio FastAPI |
| CORS_ORIGIN | Origen permitido para clientes |

#### Ejecución Local
```bash
npm run start:dev
```

#### Comandos Útiles
- `npm run build` - Compilación
- `npm run test` - Pruebas
- `npm run test:e2e` - Pruebas end-to-end
- `npm run lint` - Lint
- `npm run format` - Formato

### Base de Datos

#### Modelo de Datos
El Core NestJS usa PostgreSQL/Supabase para almacenar información transaccional del negocio.

#### Alcance del Modelo
Cubre: tenants, usuarios, roles, permisos, pacientes, citas, medidas corporales, composición corporal, seguimiento nutricional, dietas, comidas e ítems, catálogo nutricional, recetas, plantillas de dietas, dietocálculo, seguimiento diario, antropometría avanzada, reportes y metadatos documentales.

#### Fuera del Modelo del Core
No se modelan como tablas PostgreSQL: planes SaaS, suscripciones, pagos, facturas, renovaciones, límites de plan. Estos datos pertenecen a .NET + DynamoDB.

#### Principios de Diseño
- Todas las entidades del negocio tienen `tenant_id`
- Relaciones no cruzan tenants
- Registros clínicos usan eliminación lógica
- Dietas guardan snapshot nutricional
- Ítems alimenticios tienen una sola fuente
- Operaciones críticas dejan trazabilidad
- Documentos solo son metadatos
- Prisma es la herramienta documentada

#### Migraciones - Orden Implementable
1. Tenants
2. Seguridad y acceso (roles, permisos, usuarios)
3. Pacientes
4. Citas
5. Medidas corporales
6. Composición corporal
7. Seguimiento nutricional
8. Dietas, comidas e ítems
9. Catálogo nutricional y recetas
10. Plantillas de dietas
11. Dietocálculo
12. Seguimiento diario
13. Antropometría avanzada
14. Reportes y metadatos

#### Índices Recomendados
- tenant_id
- tenant_id + status
- tenant_id + created_at
- patient_id
- nutritionist_id
- scheduled_at
- patient_id + measured_at
- diet_id
- tracked_at
- measured_at

### Relaciones Multi-Tenant

#### Cardinalidades Principales
- Tenant → User (1:N)
- Tenant → Patient (1:N)
- Role → User (1:N)
- Role ↔ Permission (N:M)
- Nutricionista → Patient (1:N)
- Patient → Appointment (1:N)
- Patient → BodyMeasurement (1:N)
- Patient → Diet (1:N)
- Diet → DietMeal (1:N)
- Tenant → FoodCatalogItem (1:N)
- FoodCatalogItem → Recipe (1:N)

#### Ownership Multi-Tenant
Entidades con tenantId obligatorio: User, Patient, Appointment, BodyMeasurement, BodyComposition, NutritionTracking, Diet, FoodCatalogItem, Recipe, DietTemplate, NutritionCalculation, DailyTrackingEntry, PatientGoal, AnthropometryMeasurement, SomatotypeResult, Report, DocumentMetadata

#### Reglas de Integridad
- Paciente no asignado a nutricionista de otro tenant
- Cita relaciona paciente y nutricionista del mismo tenant
- Medida solo pertenece a paciente del mismo tenant
- Dieta solo asignada a paciente del mismo tenant
- Alimento, receta o plantilla reutilizable dentro del mismo tenant
- Cálculo nutricional asociado a dieta del mismo tenant
- Seguimiento diario solo del paciente autenticado o asignado
- Foto documental referencia metadatos del mismo tenant
- Medición antropométrica solo de paciente del mismo tenant
- Resultado de somatotipo derivado de medición del mismo tenant

### Pruebas

#### Pruebas GraphQL
Validan queries y mutations expuestas por el Core.

**Casos sugeridos:**
- login devuelve token
- patients requiere autenticación
- createPatient requiere permiso
- appointments filtra por tenant
- foodCatalog lista alimentos del tenant
- createFoodCatalogItem requiere rol
- createRecipe valida alimentos del mismo tenant
- dietTemplates lista plantillas del nutricionista
- createDietFromTemplate genera dieta
- createDiet guarda snapshot nutricional
- calculateDietNutrition devuelve macronutrientes
- saveNutritionCalculation rechaza sin dietId
- createDailyTrackingEntry permite registro propio
- requestDailyFoodPhotoUpload devuelve URL prefirmada
- addDailyFoodPhoto vincula documento
- patientGoals lista metas del paciente
- dailyTrackingByPatient impide consultar otro paciente
- createAnthropometryMeasurement requiere nutricionista
- calculateSomatotype rechaza datos incompletos
- latestSomatotype devuelve último resultado

#### Pruebas de Integración
Validan módulos conectados con base de datos o servicios simulados.

**Casos sugeridos:**
- Usuario autenticado consulta pacientes de su tenant
- Usuario no accede a datos de otro tenant
- Core consulta .NET para validar suscripción
- Core solicita PDF al servicio Documental
- Nutricionista crea alimento y lo usa en receta
- Nutricionista crea plantilla y genera dieta
- Dieta generada conserva snapshot nutricional
- Core calcula nutrientes y guarda resultado
- Core rechaza guardar cálculo sin dieta
- Paciente registra seguimiento diario
- Paciente solicita URL prefirmada y sube foto
- Paciente crea meta y la marca completada
- Nutricionista consulta seguimiento de paciente
- Nutricionista registra antropometría
- Dashboard consume adherencia y evolución

#### Pruebas Unitarias
Validan servicios y reglas de negocio aisladas.

**Herramienta:** Jest

**Casos sugeridos:**
- Crear paciente válido
- Rechazar paciente sin tenant
- Crear cita con fecha válida
- Rechazar cita cancelada
- Calcular IMC
- Validar permiso para crear dieta
- Calcular calorías y macronutrientes
- Consolidar micronutrientes
- Validar fuente única en DietItem
- Generar snapshot nutricional
- Confirmar cambios en catálogo no alteran dietas
- Rechazar saveNutritionCalculation sin dietId
- Rechazar receta con alimentos de otro tenant
- Crear dieta desde plantilla
- Validar paciente registra seguimiento propio
- Validar creación de metas
- Calcular somatotipo
- Rechazar somatotipo sin campos mínimos
- Validar permisos para catálogo y plantillas

### Despliegue

#### Despliegue en AWS
El Core NestJS se desplegará en AWS.

**Pasos generales:**
1. Preparar build de producción
2. Configurar variables de entorno
3. Configurar conexión a PostgreSQL/Supabase
4. Configurar URLs de microservicios externos
5. Desplegar contenedor o servicio
6. Verificar endpoint GraphQL

#### Docker
Docker permite empaquetar el microservicio para despliegue.

**Elementos esperados:**
- Dockerfile
- .dockerignore
- Variables de entorno
- Comando de inicio productivo

**Consideraciones:**
- No copiar .env con secretos
- Ejecutar build antes de producción
- Configurar conexión segura a PostgreSQL

#### Troubleshooting

| Problema | Verificar |
|---|---|
| Error de conexión a BD | DATABASE_URL, acceso de red, credenciales, estado de PostgreSQL |
| Error de autenticación | JWT_SECRET, expiración, header Authorization |
| Error de CORS | CORS_ORIGIN, dominio del frontend |
| Error comunicando microservicios | URLs de servicios, disponibilidad, logs |
| Error GraphQL | Schema, resolver, guards, permisos, input |

#### Variables de Producción
- NODE_ENV=production
- PORT
- DATABASE_URL
- JWT_SECRET
- JWT_EXPIRES_IN
- PAYMENTS_SERVICE_URL
- DOCUMENTS_SERVICE_URL
- AI_SERVICE_URL
- CORS_ORIGIN

---

## Aplicación Web Angular

### Objetivo General
Proveer interfaz Angular para que administradores y nutricionistas operen VitalBite de forma segura, modular y alineada al Core GraphQL.

### Objetivos Funcionales
- Autenticar usuarios administrativos
- Gestionar pacientes y su información nutricional
- Gestionar citas y calendario
- Registrar medidas corporales y antropometría
- Crear dietas, usar plantillas, consultar dietocálculo
- Administrar catálogo nutricional
- Revisar seguimiento nutricional
- Generar y consultar documentos y reportes
- Consultar dashboard BI
- Gestionar pagos, suscripciones y límites

### Objetivos Técnicos
- Usar Angular como framework principal
- Consumir GraphQL mediante services por dominio
- Proteger rutas con guards
- Mantener componentes reutilizables
- Separar pantallas, services, modelos, guards e interceptores

### Responsabilidades Principales
- Presentar interfaz administrativa
- Consumir Core NestJS mediante GraphQL
- Gestionar estado de sesión y JWT
- Mostrar información empresarial y nutricional
- Validar formularios antes de enviar
- Manejar estados de carga, error, vacío y éxito

### Responsabilidades por Módulo
| Módulo Web | Responsabilidad |
|---|---|
| Login | Autenticación y apertura de sesión |
| Dashboard | Indicadores administrativos y BI |
| Pacientes | Registro, edición, búsqueda y detalle |
| Citas | Agenda, confirmación, reprogramación |
| Medidas corporales | Registro de medidas y antropometría |
| Seguimiento nutricional | Progreso, adherencia, alertas |
| Dietas | Creación, plantillas, dietocálculo |
| Catálogo nutricional | Alimentos, recetas y preparaciones |
| Documentos y reportes | Solicitud, descarga, visualización |
| Pagos y suscripciones | Estado de plan, límites, pagos |
| Configuración | Perfil, tenant, preferencias |

### Fuera de Alcance
- No procesa pagos directamente
- No ejecuta modelos IA/ML
- No reemplaza app móvil del paciente

### Requisitos Técnicos
- Node.js LTS
- npm
- Angular CLI
- Navegador moderno
- Acceso al endpoint GraphQL del Core
- Variables de entorno

### Dependencias Esperadas
- Angular
- Apollo Angular o cliente GraphQL equivalente
- RxJS
- Formularios reactivos de Angular
- Librería de gráficos para BI
- Componentes UI definidos por el equipo

### Servicios Requeridos
- Core NestJS + GraphQL
- Servicio Documental para URLs prefirmadas
- Microservicio .NET para pagos (consultado por Core)
- FastAPI para resultados IA/ML (consultado por Core)

### Variables de Entorno
| Variable | Uso |
|---|---|
| NG_APP_GRAPHQL_URL | Endpoint GraphQL del Core |
| NG_APP_NAME | Nombre visible de la aplicación |
| NG_APP_ENV | Entorno: local, staging, production |
| NG_APP_TOKEN_STORAGE | Estrategia: localStorage o sessionStorage |
| NG_APP_ENABLE_GRAPHQL_LOGS | Habilita logs en desarrollo |

#### Reglas de Variables
- No guardar secretos backend
- No exponer claves privadas
- Token JWT se obtiene desde login
- URL GraphQL apunta al Core

### Instalación
```bash
npm install
```

#### Configuración Inicial
1. Crear archivo de variables de entorno
2. Configurar URL del endpoint GraphQL
3. Configurar nombre de aplicación
4. Configurar política de almacenamiento del token
5. Instalar dependencias de GraphQL, UI y gráficos

#### Ejecución Local
```bash
ng serve
```

#### Verificación
La aplicación debe iniciar sin errores, mostrar `/login` y conectarse al endpoint GraphQL.

### Comandos Útiles
- `ng serve` - Desarrollo
- `ng build` - Compilación
- `ng test` - Pruebas
- `ng lint` - Lint
- `ng generate component features/patients/pages/patients-list` - Generar componente
- `ng generate service core/graphql/graphql` - Generar servicio
- `ng generate guard core/guards/auth` - Generar guard

### Arquitectura General

#### Capas Principales
- **Pages:** Pantallas asociadas a rutas
- **Components UI:** Elementos reutilizables
- **Services:** Consumo GraphQL y lógica
- **Models:** Interfaces TypeScript
- **Guards:** Protección de rutas
- **Interceptors:** Inyección de token y manejo de errores

#### Integración Principal
```
Angular Web
  ↓ GraphQL
Core NestJS
  ↓ integraciones internas
Documental / FastAPI / .NET
```

#### Regla Central
La Web no llama directamente a microservicios secundarios. El Core GraphQL conserva el contrato central.

### Comunicación GraphQL

#### Endpoint
Usa la variable `NG_APP_GRAPHQL_URL`.

#### Patrón de Consumo
1. Pantalla invoca service Angular
2. Service ejecuta query o mutation GraphQL
3. Interceptor agrega JWT
4. Core valida token, rol, permisos y tenant
5. Respuesta se transforma en modelo de vista

#### Reglas
- No consumir REST como canal principal
- No llamar directamente a servicios secundarios
- Centralizar errores GraphQL
- Mantener queries y mutations por dominio

### Estructura de Carpetas
```
src/app/
├── core/
│   ├── graphql/
│   ├── guards/
│   ├── interceptors/
│   ├── models/
│   └── services/
├── shared/
│   ├── components/
│   ├── pipes/
│   └── validators/
├── layout/
│   ├── main-layout/
│   ├── sidebar/
│   └── topbar/
├── features/
│   ├── auth/
│   ├── dashboard/
│   ├── patients/
│   ├── appointments/
│   ├── body-measurements/
│   ├── nutrition-tracking/
│   ├── diets/
│   ├── nutrition-catalog/
│   ├── diet-templates/
│   ├── anthropometry/
│   ├── documents-reports/
│   ├── payments-subscriptions/
│   └── settings/
└── app.routes.ts
```

#### Criterio de Organización
- Cada feature agrupa páginas, componentes y service
- core contiene infraestructura compartida
- shared contiene UI sin lógica de negocio
- layout contiene navegación global

### Flujo de Navegación

#### Flujo Principal
1. Usuario ingresa a `/login`
2. Web ejecuta `login(input)` contra Core GraphQL
3. Core devuelve JWT y datos del usuario
4. Web guarda sesión
5. Guards validan acceso a rutas internas
6. Usuario accede a dashboard y módulos permitidos

#### Rutas Principales
- `/login` - Autenticación
- `/dashboard` - Panel administrativo
- `/patients` - Gestión de pacientes
- `/patients/:id` - Detalle de paciente
- `/appointments` - Gestión de citas
- `/body-measurements` - Medidas corporales
- `/nutrition-tracking` - Seguimiento nutricional
- `/diets` - Gestión de dietas
- `/nutrition-catalog` - Catálogo de alimentos
- `/diet-templates` - Plantillas de dietas
- `/anthropometry` - Antropometría avanzada
- `/documents-reports` - Documentos y reportes
- `/payments-subscriptions` - Pagos y suscripciones
- `/settings` - Configuración

#### Reglas de Navegación
- No autenticado solo accede a `/login`
- Administrador accede a módulos administrativos y BI
- Nutricionista accede a operación clínica
- Paciente no accede a la Web

### Resumen del Rol Web Angular
La Web Angular de VitalBite es un panel administrativo modular consumidor de GraphQL que centraliza la operación empresarial y nutricional para nutricionistas y administradores. Se organiza por features, consume el Core mediante GraphQL, protege rutas mediante guards, implementa componentes reutilizables y mantiene separación clara entre capas de presentación, servicios y modelos.

---

## Reglas de Examen

### Cumplimiento de Requisitos

| Requisito | Cumplimiento en VitalBite |
|---|---|
| Mínimo 3 microservicios | 4 microservicios: Core NestJS, Documental Spring Boot, IA/ML/DL FastAPI y Pagos .NET |
| Microservicios desplegados en nubes diferentes | Core en AWS, Documental en Google Cloud, IA/ML/DL en Digital Ocean, Pagos en Azure |
| Web desarrollada en Angular | Sí, panel administrativo para nutricionistas y administradores |
| Mobile desarrollada en React Native | Sí, app para pacientes |
| Comunicación mediante GraphQL | Sí, Core NestJS expone GraphQL como comunicación principal |
| No usar REST como comunicación principal | Sí, REST solo para integraciones especializadas |
| Base de datos principal PostgreSQL | Sí, PostgreSQL/Supabase base transaccional del Core |
| Base de datos secundaria DynamoDB | Sí, base principal del microservicio .NET |
| Gestión documental y S3 | Sí, Spring Boot gestiona PDFs y almacenamiento |
| App móvil con componentes nativos | Sí, React Native con cámara, huella biométrica y notificaciones |
| Uso de cámara o huella | Sí, captura de etiquetas y autenticación biométrica |
| Deep Learning aplicado a imágenes | Sí, FastAPI procesa OCR de etiquetas |
| Machine Learning con Random Forest | Sí, FastAPI para predicción de riesgo |
| Machine Learning con K-means | Sí, FastAPI para segmentación de pacientes |
| Dashboard de inteligencia de negocio | Sí, Angular muestra métricas desde Core y DynamoDB |
| Blockchain mínimo a nivel de registro | Sí, Spring Boot registra hashes para auditoría |
| Automatización con n8n en tres pasos | Sí, flujo WhatsApp → Core → Email/notificación |

### Reglas Técnicas Obligatorias
- GraphQL es la comunicación principal del sistema ✓
- PostgreSQL/Supabase es la base de datos principal del Core ✓
- DynamoDB es base secundaria y principal para pagos/BI ✓
- Amazon S3 es almacenamiento de objetos, no BD ✓
- Sistema mantiene separación por microservicios ✓
- Arquitectura explica multi-cloud ✓
- IA, ML, BI, blockchain y n8n están integrados al flujo empresarial ✓
- Funciones dietocálculo, catálogo, plantillas, seguimiento diario y somatocarta refuerzan módulos core ✓
- FastAPI apoya análisis visual, pero no reemplaza dietocálculo del Core ✓

### Evidencia Documental
✓ Visión general describe alcance SaaS, actores y capacidades
✓ Arquitectura general explica microservicios, nubes, datos y comunicación
✓ Decisiones técnicas justifican tecnologías elegidas
✓ Módulos core muestran actores, datos y microservicios responsables
✓ Documentación incluye capacidades nutricionales avanzadas
✓ Checklist valida cumplimiento de cada requisito

---

## Conclusión

VitalBite es una plataforma empresarial SaaS completa de nutrición y salud que cumple con todos los requisitos del examen. Implementa:

- **Arquitectura Multi-Microservicios:** 4 servicios especializados en AWS, Google Cloud, Digital Ocean y Azure
- **Comunicación GraphQL Centralizada:** Core NestJS como hub principal
- **Bases de Datos Complementarias:** PostgreSQL para transacciones, DynamoDB para BI y pagos
- **Aplicaciones Cliente Especializadas:** Web Angular para administración y React Native para pacientes
- **Capacidades Avanzadas:** IA/ML/DL, Deep Learning, Random Forest, K-means, blockchain, n8n, somatocarta
- **Dominio Nutricional Operativo:** Dietocálculo, catálogo, plantillas, seguimiento diario, antropometría
- **Multi-Tenant con Seguridad:** JWT, roles, permisos y aislamiento por tenant

La documentación completa proporciona especificación detallada, diseño técnico, reglas de negocio, APIs GraphQL, estructura de datos y roadmap de implementación para todos los microservicios y aplicaciones cliente.

---

**Fin del resumen completo de documentación**
