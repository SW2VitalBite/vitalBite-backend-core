# Módulos Core Empresariales

Los módulos core representan las funcionalidades principales del sistema VitalBite. Cada módulo se relaciona con un actor principal, un microservicio dueño y una fuente de datos o almacenamiento.

## 1. Gestión de Usuarios y Roles

Administra usuarios, credenciales, roles, permisos y separación multi-tenant.

- **Actor principal:** Administrador.
- **Microservicio dueño:** Core empresarial NestJS + GraphQL.
- **Datos principales:** usuarios, roles, permisos, tenants y sesiones.
- **Base de datos:** PostgreSQL/Supabase.
- **Relación con el sistema:** controla el acceso de administradores, nutricionistas y pacientes a web y móvil.

Roles principales:

- Administrador.
- Nutricionista.
- Paciente.

## 2. Gestión de Pacientes

Permite registrar, actualizar y consultar información clínica y administrativa de pacientes.

- **Actor principal:** Nutricionista.
- **Microservicio dueño:** Core empresarial NestJS + GraphQL.
- **Datos principales:** datos personales, antecedentes, objetivos nutricionales, estado y nutricionista asignado.
- **Base de datos:** PostgreSQL/Supabase.
- **Relación con el sistema:** alimenta citas, medidas corporales, dietas, seguimiento, ML y reportes.

## 3. Gestión de Citas

Permite administrar la agenda nutricional y el estado de las consultas.

- **Actor principal:** Nutricionista y paciente.
- **Microservicio dueño:** Core empresarial NestJS + GraphQL.
- **Datos principales:** fecha, hora, paciente, nutricionista, estado, motivo y observaciones.
- **Base de datos:** PostgreSQL/Supabase.
- **Relación con el sistema:** se integra con n8n para confirmaciones, recordatorios y notificaciones.

Operaciones principales:

- Agendar cita.
- Confirmar cita.
- Reprogramar cita.
- Cancelar cita.
- Consultar calendario.
- Registrar estado de la cita.

## 4. Gestión de Medidas Corporales

Registra la evolución física y nutricional del paciente.

- **Actor principal:** Nutricionista.
- **Microservicio dueño:** Core empresarial NestJS + GraphQL.
- **Datos principales:** peso, talla, IMC, perímetros, pliegues, diámetros, grasa corporal, masa muscular, agua corporal, bioimpedancia, somatotipo y somatocarta / antropometría avanzada.
- **Base de datos:** PostgreSQL/Supabase.
- **Relación con el sistema:** alimenta seguimiento, reportes, Random Forest, K-means y dashboard BI.

Incluye:

- Registro de medidas básicas y composición corporal.
- Registro de pliegues y diámetros para análisis antropométrico.
- Cálculo o visualización de somatotipo cuando existan datos suficientes.
- Somatocarta para pacientes deportivos o seguimiento avanzado.
- Comparación histórica de evolución corporal.

## 5. Seguimiento Nutricional

Permite controlar la evolución del paciente a lo largo del tiempo.

- **Actor principal:** Nutricionista y paciente.
- **Microservicio dueño:** Core empresarial NestJS + GraphQL.
- **Datos principales:** progreso, cumplimiento de dieta, observaciones, alertas, fotos de alimentos, actividad física, estado de ánimo, metas, adherencia e indicadores.
- **Base de datos:** PostgreSQL/Supabase y métricas en DynamoDB.
- **Relación con el sistema:** muestra gráficos en web/móvil y genera información para BI.

Incluye:

- Historial de progreso.
- Comparación de medidas.
- Seguimiento diario del paciente desde la app móvil.
- Registro fotográfico de alimentos consumidos.
- Registro de actividad física.
- Estado de ánimo o motivación del paciente.
- Metas personales y adherencia al plan.
- Observaciones del nutricionista.
- Cumplimiento de dieta.
- Alertas de bajo progreso.
- Gráficos de evolución.

## 6. Gestión de Dietas o Planes Alimenticios

Permite crear y asignar planes alimenticios personalizados.

- **Actor principal:** Nutricionista.
- **Microservicio dueño:** Core empresarial NestJS + GraphQL.
- **Datos principales:** plan alimenticio, comidas, alimentos, recetas, porciones, restricciones, objetivo, vigencia, calorías, macronutrientes, micronutrientes y plantillas reutilizables.
- **Base de datos:** PostgreSQL/Supabase.
- **Relación con el sistema:** puede generar PDFs mediante Documental, ser consultado desde la app móvil y alimentar seguimiento, BI y recomendaciones.

Incluye:

- Creación de dietas.
- Dietocálculo / cálculo nutricional de calorías, macronutrientes y micronutrientes.
- Catálogo de alimentos y recetas.
- Plantillas de dietas reutilizables.
- Comidas por día.
- Alimentos permitidos.
- Alimentos restringidos.
- Objetivo de la dieta.
- Actualización del plan según progreso.

## 7. Gestión Documental y Reportes

Permite generar, almacenar y entregar documentos del proceso nutricional.

- **Actor principal:** Nutricionista, administrador y paciente.
- **Microservicio dueño:** Documental Spring Boot.
- **Datos principales:** metadatos de documentos, tipo, paciente, fecha, URL prefirmada y estado.
- **Almacenamiento:** Amazon S3 para archivos y PostgreSQL/Supabase para metadatos.
- **Relación con el sistema:** genera PDFs de dietas, fichas, reportes e historial nutricional.

Incluye:

- Reportes PDF.
- Fichas de pacientes.
- Dietas descargables.
- Historial nutricional.
- Archivos e imágenes.
- URLs prefirmadas para descarga segura.

## 8. Gestión de Pagos y Suscripciones

Permite administrar el modelo SaaS del sistema.

- **Actor principal:** Administrador.
- **Microservicio dueño:** Pagos y suscripciones .NET.
- **Datos principales:** planes, pagos, facturas, renovaciones, límites y estado de suscripción.
- **Base de datos:** DynamoDB como store principal del microservicio .NET.
- **Relación con el sistema:** el Core consulta a .NET para validar estado de suscripción, plan activo y límites del tenant; .NET notifica al Documental eventos financieros auditables.

Incluye:

- Planes.
- Pagos.
- Renovaciones.
- Estado de suscripción.
- Facturación.
- Historial de pagos.
- Límites por tenant según plan contratado.

## 9. Dashboard Administrativo / BI

Permite visualizar indicadores del negocio y del proceso nutricional.

- **Actor principal:** Administrador y nutricionista.
- **Microservicio dueño:** Core empresarial NestJS + GraphQL.
- **Datos principales:** eventos, métricas, indicadores, tendencias y resultados de modelos.
- **Base de datos:** DynamoDB para métricas, analítica e indicadores financieros; PostgreSQL/Supabase para datos transaccionales del Core empresarial.
- **Relación con el sistema:** muestra resultados de Random Forest, K-means, citas, ingresos, dietocálculo, adherencia, seguimiento diario y evolución de pacientes.

Indicadores:

- Pacientes activos.
- Citas realizadas.
- Citas canceladas.
- Cumplimiento de dietas.
- Evolución promedio de pacientes.
- Evolución antropométrica y composición corporal.
- Adherencia diaria al plan alimenticio.
- Tendencias de actividad física, estado de ánimo y metas.
- Resumen de dietocálculo por paciente o grupo.
- Ingresos por suscripción.
- Indicadores de riesgo nutricional.
- Segmentación de pacientes.

## 10. Auditoría y Bitácora del Sistema

Permite registrar acciones importantes para trazabilidad e integridad.

- **Actor principal:** Administrador.
- **Microservicio dueño:** Documental Spring Boot.
- **Datos principales:** evento, usuario, fecha, recurso afectado, hash, tipo de acción y referencia blockchain.
- **Base de datos/registro:** metadatos en PostgreSQL/Supabase y registro blockchain para eventos críticos.
- **Relación con el sistema:** audita cambios relevantes del Core, Documental y Pagos.

Incluye:

- Creación de registros.
- Actualización de información crítica.
- Cambios en citas.
- Cambios en dietas.
- Pagos registrados.
- Generación y acceso a documentos.
- Hashes o registros blockchain para integridad.

## Módulos de IA, ML y automatización asociados

Aunque no forman parte del Core transaccional tradicional, estos componentes complementan los módulos empresariales:

- **IA / Deep Learning:** lectura de etiquetas nutricionales e imágenes desde la app móvil; apoya el análisis visual de alimentos, pero no reemplaza el dietocálculo / cálculo nutricional del Core.
- **Random Forest:** predicción de riesgo nutricional con datos de pacientes, medidas y hábitos.
- **K-means:** segmentación de pacientes para BI y recomendaciones.
- **n8n:** automatización de recordatorios y confirmaciones mediante WhatsApp → Core/Sistema → Email o notificación.
