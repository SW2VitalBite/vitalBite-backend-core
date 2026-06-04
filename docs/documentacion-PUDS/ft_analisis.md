# Capítulo 2: Flujo de Trabajo de Análisis — Paquetes de Sistema y Modelado de Interacción (PUDS)

El flujo de trabajo de análisis traduce los requisitos funcionales en una arquitectura de objetos conceptuales independiente del entorno técnico detallado, garantizando que el sistema sea extensible y mantenga una cohesión alta.

---

## 1. Identificación y Descripción de Paquetes de Análisis

Para organizar el modelo de análisis, las clases y realizaciones de casos de uso se agrupan en **Paquetes de Análisis**. Cada paquete representa un subsistema lógico cohesivo dentro del ecosistema SaaS de **VitalBite**:

1. **`PK_Seguridad_Aislamiento` (Seguridad y Multi-Tenant):** Encargado de centralizar la autenticación biométrica y por contraseñas, la autorización basada en roles (RBAC) y la interceptación del identificador corporativo (`TenantID`) para garantizar el aislamiento absoluto de los datos en memoria antes de cualquier consulta.
2. **`PK_Gestion_Clinica_Core` (Gestión Clínica Transaccional):** Agrupa la lógica del negocio clínico cotidiano. Gobierna el ciclo de vida de las fichas de los pacientes, el control de la agenda médica (citas) y la captura cronológica de parámetros físicos y medidas antropométricas.
3. **`PK_Prescripcion_Nutricional` (Planificación Alimenticia):** Especializado en el modelado de menús, alimentos, raciones y macronutrientes. Administra el diseño de planes dietéticos por parte del nutricionista y la estrategia de sincronización para la lectura interactiva desde la app móvil del paciente.
4. **`PK_Analitica_Inteligencia` (IA y Dashboard BI):** Subsistema encargado de orquestar el procesamiento inteligente de datos. Consolida las llamadas hacia los motores de visión computacional (OCR de etiquetas), aprendizaje supervisado (Random Forest para riesgos de salud) y aprendizaje no supervisado (K-means para segmentación poblacional), además de estructurar los cubos de datos para el Dashboard de Business Intelligence.
5. **`PK_Automatizacion_Mensajeria` (Integración de Eventos Asíncronos):** Abstrae los webhooks, disparadores y colas de eventos que permiten interactuar de manera externa y asíncrona con el paciente (notificaciones push y mensajería automatizada por WhatsApp).
6. **`PK_SaaS_Finanzas_Auditoria` (Estructura Comercial e Integridad):** Administra el catálogo global de planes de suscripción, el procesamiento de las colas de facturación, la conciliación de pagos de los tenants y el sellado criptográfico inmutable de eventos críticos para la auditoría forense del sistema.

---

## 2. Matriz de Trazabilidad: Paquetes de Análisis vs. Casos de Uso

La siguiente matriz asegura la cobertura total de los requisitos del sistema, mapeando qué paquete de análisis es responsable de contener la lógica de cada Caso de Uso (CU):

| Código CU | Nombre del Caso de Uso | Paquete de Análisis Responsable |
| :--- | :--- | :--- |
| **CU1** | Gestionar Expediente de Pacientes | `PK_Gestion_Clinica_Core` |
| **CU2** | Gestionar Control de Citas Médicas | `PK_Gestion_Clinica_Core` |
| **CU3** | Registrar Medidas y Composición Corporal | `PK_Gestion_Clinica_Core` |
| **CU4** | Diseñar y Asignar Planes Dietéticos | `PK_Prescripcion_Nutricional` |
| **CU5** | Consultar Plan Alimenticio Asignado | `PK_Prescripcion_Nutricional` |
| **CU6** | Autenticación y Control de Acceso Multi-Tenant | `PK_Seguridad_Aislamiento` |
| **CU7** | Monitorear Evolución Física y Dashboard BI | `PK_Analitica_Inteligencia` |
| **CU8** | Generar y Exportar Reporte Nutricional en PDF | `PK_SaaS_Finanzas_Auditoria` |
| **CU9** | Analizar Etiquetas y Alimentos con Deep Learning | `PK_Analitica_Inteligencia` |
| **CU10** | Evaluar Predicción de Riesgo de Salud | `PK_Analitica_Inteligencia` |
| **CU11** | Consultar Segmentación de Perfiles | `PK_Analitica_Inteligencia` |
| **CU12** | Automatizar Flujos de Citas y Notificaciones | `PK_Automatizacion_Mensajeria` |
| **CU13** | Auditar Integridad de Eventos Críticos | `PK_SaaS_Finanzas_Auditoria` |
| **CU14** | Gestionar Ofertas de Planes y Suscripciones SaaS | `PK_SaaS_Finanzas_Auditoria` |
| **CU15** | Conciliar Pagos y Facturación Global | `PK_SaaS_Finanzas_Auditoria` |

---

## 3. Filtrado de Casos de Uso Críticos para Modelado UML 2.5+

Para la elaboración de los diagramas de interacción en la fase de análisis, se seleccionan **3 Casos de Uso Críticos**. El criterio de filtrado responde al **análisis de riesgos arquitectónicos** y al **núcleo de valor del negocio**:
1. **CU6 (Autenticación y Control Multi-Tenant):** Mitiga el riesgo de seguridad física y lógica. Valida el aislamiento que rige a todo el sistema SaaS.
2. **CU4 (Diseñar y Asignar Planes Dietéticos):** Representa el núcleo transaccional clínico de mayor complejidad en el cruce de datos relacionales del Core.
3. **CU9 (Analizar Etiquetas y Alimentos con Deep Learning):** Representa el desafío de integración de componentes avanzados (IA/Móvil) y flujos asíncronos no convencionales.

A continuación se presentan los diagramas de secuencia utilizando la notación formal estereotipada de PUDS (**Boundary, Control, Entity**) expresados en código **PlantUML (UML 2.5+)**.

### 3.1 Diagrama de Secuencia de Análisis — CU6: Autenticación y Control de Acceso Multi-Tenant

Este diagrama analiza cómo se intercepta la identidad del usuario, se valida biométricamente o por contraseñas, y se inyecta el alcance del aislamiento del tenant dentro de un token de seguridad unificado.

```plantuml
@startuml Diagrama_Analisis_CU6
skinparam style strictuml
skinparam boxPadding 10

title Diagrama de Secuencia de Análisis - CU6: Autenticación y Control Multi-Tenant (UML 2.5)

actor "Usuario (A1/A2/A3)" as ActorClient
box "Capa Frontera (Boundary)" #LightBlue
    boundary "FormularioLogin_Frm" as UI
end box

box "Capa Control (Control)" #LightYellow
    control "Autenticador_Ctrl" as Ctrl
    control "ValidadorTenant_Ctrl" as TenantCtrl
end box

box "Capa Entidad (Entity)" #LightGreen
    entity "Usuario" as EntUser
    entity "Tenant" as EntTenant
    database "PostgreSQL_DB" as DB
end box

ActorClient -> UI : 1. IntroducirCredenciales o ActivarBiometria()
activate UI
UI -> Ctrl : 2. SolicitarAutenticacion(email, pass/hash)
activate Ctrl

Ctrl -> EntUser : 3. BuscarUsuarioPorEmail(email)
activate EntUser
EntUser -> DB : 4. ConsultarRegistro()
activate DB
DB --> EntUser : 5. RegistroEncontrado(datosEncriptados)
deactivate DB
EntUser --> Ctrl : 6. DevolverDatosUsuario()
deactivate EntUser

Ctrl -> Ctrl : 7. VerificarCoincidenciaCriptografica()

alt Credenciales Válidas
    Ctrl -> TenantCtrl : 8. ValidarEstadoTenant(tenantId)
    activate TenantCtrl
    
    TenantCtrl -> EntTenant : 9. VerificarSuscripcionActiva()
    activate EntTenant
    EntTenant -> DB : 10. ConsultarEstadoSuscripcion()
    activate DB
    DB --> EntTenant : 11. EstadoSuscripcion(Activo)
    deactivate DB
    EntTenant --> TenantCtrl : 12. ConfirmarTenantApto()
    deactivate EntTenant
    
    TenantCtrl --> Ctrl : 13. TenantValidadoExitosamente()
    deactivate TenantCtrl
    
    Ctrl -> Ctrl : 14. GenerarTokenJWT(userId, rol, tenantId)
    Ctrl --> UI : 15. DevolverTokenSeguroJWT()
    UI --> ActorClient : 16. RedirigirAlDashboardSegunRol()
else Credenciales Inválidas u Origen Corrupto
    Ctrl --> UI : 15a. DenegarAcceso(MensajeError)
    UI --> ActorClient : 16a. MostrarAlertaDeSeguridad()
end

deactivate Ctrl
deactivate UI
@enduml