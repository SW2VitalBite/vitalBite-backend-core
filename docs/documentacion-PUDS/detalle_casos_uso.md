# Capítulo 2: Captura de Requisitos — Identificación de Actores y Casos de Uso (PUDS)

Este documento contiene la especificación formal de requisitos para la plataforma SaaS **VitalBite**, desarrollada bajo el marco del Proceso Unificado de Desarrollo de Software (PUDS). Debido a las restricciones de tiempo y alcance académico, los requerimientos se distribuyen en dos ciclos de desarrollo: el **Ciclo 1** enfocado en el núcleo transaccional y el **Ciclo 2** enfocado en capacidades avanzadas (IA, automatización, BI y auditoría inmutable).

---

## 1. Identificación de Actores

De acuerdo con la metodología PUDS, un actor representa un rol externo que interactúa directamente con el sistema. En VitalBite se definen los siguientes actores primarios:

* **A1: Paciente:** Usuario final que recibe la asesoría nutricional. Interactúa exclusivamente a través de la aplicación móvil (React Native) para consultar sus planes alimenticios, registrar su progreso, gestionar citas y utilizar herramientas analíticas de visión por computadora.
* **A2: Nutricionista:** Profesional de la salud o consultorio clínico clínico suscrito a la plataforma. Interactúa mediante la aplicación web (Angular) para administrar su cartera de clientes, registrar mediciones corporales, diseñar planes dietéticos y consumir herramientas de Machine Learning predictivo y descriptivo.
* **A3: Super Administrador:** Operador global del ecosistema SaaS. Cuenta con privilegios absolutos en la aplicación web (Angular) para gestionar las condiciones comerciales, dar de alta u ocultar ofertas de suscripción, auditar los flujos financieros globales y revisar la bitácora criptográfica inmutable del sistema.

---

## 2. Matriz de Priorización y Catálogo de Casos de Uso

La siguiente tabla consolida el catálogo completo de casos de uso del sistema, especificando su nivel de prioridad para el negocio, el canal de acceso asignado, los actores involucrados y el ciclo de iteración en el que se implementan:

| ID | Caso de Uso | Prioridad | Actores | Ciclo | Canal Principal | Componente Arquitectónico Asociado |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| **CU1** | Gestionar Expediente de Pacientes | Alta | A2 | 1 | Web (Angular) | Core NestJS + PostgreSQL |
| **CU2** | Gestionar Control de Citas Médicas | Alta | A1, A2 | 1 | Web / Móvil | Core NestJS + PostgreSQL |
| **CU3** | Registrar Medidas y Composición Corporal | Alta | A2 | 1 | Web (Angular) | Core NestJS + PostgreSQL |
| **CU4** | Diseñar y Asignar Planes Dietéticos | Alta | A2 | 1 | Web (Angular) | Core NestJS + PostgreSQL |
| **CU5** | Consultar Plan Alimenticio Asignado | Alta | A1 | 1 | Móvil (React Native) | Core NestJS (GraphQL API) |
| **CU6** | Autenticación y Control de Acceso Multi-Tenant | Alta | A1, A2, A3 | 1 | Web / Móvil | Core NestJS + JWT + Biométrico |
| **CU7** | Monitorear Evolución Física y Dashboard BI | Alta | A1, A2, A3 | 2 | Web / Móvil | Core + Microservicio .NET + DynamoDB |
| **CU8** | Generar y Exportar Reporte Nutricional en PDF | Media | A2 | 2 | Web (Angular) | Spring Boot + Amazon S3 |
| **CU9** | Analizar Etiquetas y Alimentos con Deep Learning | Media | A1 | 2 | Móvil (React Native) | FastAPI (Deep Learning / OCR) |
| **CU10** | Evaluar Predicción de Riesgo de Salud | Media | A2 | 2 | Web (Angular) | FastAPI (Random Forest) |
| **CU11** | Consultar Segmentación de Perfiles | Media | A2 | 2 | Web (Angular) | FastAPI (K-means Clustering) |
| **CU12** | Automatizar Flujos de Citas y Notificaciones | Media | A1, A2 | 2 | Externo (WhatsApp) | Motor n8n + Webhooks |
| **CU13** | Auditar Integridad de Eventos Críticos | Media | A3 | 2 | Web (Angular) | Spring Boot + Blockchain Ledger |
| **CU14** | Gestionar Ofertas de Planes y Suscripciones SaaS | Media | A3 | 2 | Web (Angular) | Microservicio .NET + DynamoDB |
| **CU15** | Conciliar Pagos y Facturación Global | Media | A3 | 2 | Web (Angular) | Microservicio .NET + DynamoDB |

---

## 3. Especificación Detallada de los Casos de Uso

### CICLO 1: CAPA TRANSACCIONAL Y CORE MULTI-TENANT

#### Nombre de Caso de Uso: CU1: Gestionar Expediente de Pacientes
* **Propósito:** Permitir al nutricionista administrar de forma integral la información clínica, antecedentes e historial personal de sus pacientes evaluados.
* **Actores:** A2: Nutricionista.
* **Actor Iniciador:** A2: Nutricionista.
* **Precondición:** El nutricionista debe estar autenticado en la plataforma web Angular con un Tenant ID corporativo válido y activo.
* **Flujo Principal:**
    1. El nutricionista ingresa al módulo de "Pacientes" en la interfaz web de Angular.
    2. El sistema solicita al Core NestJS la lista de pacientes asociados de forma exclusiva al Tenant ID actual.
    3. El sistema despliega el listado en pantalla y expone la opción de "Crear Ficha de Paciente".
    4. El nutricionista rellena el formulario con los datos requeridos: nombre completo, datos de contacto, objetivos de salud, antecedentes patológicos y alergias alimentarias.
    5. El nutricionista presiona "Guardar Expediente".
    6. El sistema valida la consistencia de los datos y añade la etiqueta de aislamiento del Tenant ID de fondo.
    7. El Core NestJS ejecuta la persistencia de forma segura en la base de datos relacional PostgreSQL.
    8. El panel web confirma el éxito de la operación actualizando la tabla del dashboard.
* **Post Condición:** El nuevo expediente clínico queda registrado de forma permanente en PostgreSQL bajo el aislamiento multi-tenant del consultorio.
* **Excepción:**
    * *4.a. Omisión de campos obligatorios o formatos inválidos:* El sistema interrumpe el flujo, resalta visualmente los errores en Angular y bloquea el envío al backend.
    * *6.a. Pérdida de comunicación con el microservicio:* El Core NestJS aborta la transacción relacional y notifica un mensaje de error técnico.

#### Nombre de Caso de Uso: CU2: Gestionar Control de Citas Médicas
* **Propósito:** Administrar de manera centralizada la programación, reserva, confirmación o cancelación de espacios de consulta dentro del calendario del consultorio.
* **Actores:** A1: Paciente, A2: Nutricionista.
* **Actor Iniciador:** A1: Paciente o A2: Nutricionista.
* **Precondición:** El paciente debe existir previamente en los registros del sistema y el consultorio debe tener configurada su jornada de disponibilidad de atención.
* **Flujo Principal:**
    1. El usuario accede a la sección de "Citas" desde su respectivo canal (Nutricionista en panel web o Paciente en app móvil).
    2. El sistema consulta dinámicamente los espacios de tiempo disponibles filtrados por el Tenant ID del negocio en PostgreSQL.
    3. El usuario selecciona un día y una hora libre, introduce el motivo de la consulta y presiona "Confirmar Agenda".
    4. El sistema valida en tiempo real que el bloque de tiempo seleccionado no haya sido reservado por otro usuario en paralelo.
    5. El Core NestJS almacena la cita médica asignándole un estado inicial ("Pendiente" o "Confirmada") en PostgreSQL.
    6. El sistema actualiza el calendario visual de inmediato y despacha una alerta push a la contraparte interesada.
* **Post Condición:** La cita queda agendada e indexada en PostgreSQL vinculada al paciente y al tenant del profesional de nutrición.
* **Excepción:**
    * *4.a. Conflicto de concurrencia (Cupo tomado simultáneamente):* El sistema advierte que el espacio ya no está disponible, revierte la petición operativa y solicita seleccionar un nuevo horario.

#### Nombre de Caso de Uso: CU3: Registrar Medidas y Composición Corporal
* **Propósito:** Capturar de forma estructurada los parámetros físicos, antropométricos y de pliegues grasos del paciente durante una sesión de evaluación presencial.
* **Actores:** A2: Nutricionista.
* **Actor Iniciador:** A2: Nutricionista.
* **Precondición:** El paciente debe contar con un expediente clínico activo y estar seleccionado en la sesión actual de Angular.
* **Flujo Principal:**
    1. El nutricionista navega dentro del perfil del paciente y selecciona la opción "Registrar Medidas Corporales".
    2. El sistema despliega un formulario matemático que solicita variables como peso, talla, perímetros musculares y pliegues cutáneos.
    3. El nutricionista digita los valores numéricos obtenidos en los instrumentos clínicos y presiona "Guardar Mediciones".
    4. El sistema calcula automáticamente parámetros derivados como el Índice de Masa Corporal (IMC) y tasas estimadas de porcentaje de grasa corporales.
    5. El Core NestJS valida la consistencia lógica de las métricas y las asienta en PostgreSQL con su respectiva marca de tiempo.
    6. La plataforma web notifica el éxito del registro y habilita la visualización de los datos.
* **Post Condición:** Las métricas físicas quedan guardadas cronológicamente en PostgreSQL, listas para ser consumidas por los componentes analíticos y de BI.
* **Excepción:**
    * *3.a. Registro de datos inverosímiles o negativos:* El sistema rechaza el envío del formulario mediante reglas de validación en el frontend y solicita corregir las variables fuera de rango.

#### Nombre de Caso de Uso: CU4: Diseñar y Asignar Planes Dietéticos
* **Propósito:** Estructurar planes nutricionales personalizados detallando menús, raciones por día de la semana y porciones alimenticias indicadas para las necesidades del paciente.
* **Actores:** A2: Nutricionista.
* **Actor Iniciador:** A2: Nutricionista.
* **Precondición:** El paciente debe estar correctamente registrado y el nutricionista contar con permisos de escritura en su tenant.
* **Flujo Principal:**
    1. El nutricionista selecciona el botón "Diseñar Plan Dietético" en la ficha operativa del paciente.
    2. El sistema web expone una rejilla interactiva dividida en días (lunes a domingo) y tiempos de comida (desayuno, colación, almuerzo, merienda, cena).
    3. El nutricionista busca e inserta los alimentos sugeridos, digita el gramaje estricto de las porciones y añade restricciones o pautas específicas.
    4. El nutricionista finaliza la configuración y presiona "Asignar y Publicar Dieta".
    5. El Core NestJS empaqueta la estructura relacional/JSON del plan y la guarda de manera persistente en PostgreSQL.
    6. El sistema modifica el estado de la dieta a "Vigente" y actualiza la disponibilidad de consulta remota.
* **Post Condición:** El plan dietético queda almacenado de forma permanente en PostgreSQL y queda indexado directamente al ID del paciente.
* **Excepción:**
    * *4.a. Intento de publicación de plan vacío o incompleto:* El sistema detiene la operación indicando que se debe configurar al menos un menú estructurado para proceder.

#### Nombre de Caso de Uso: CU5: Consultar Plan Alimenticio Asignado
* **Propósito:** Permitir al paciente visualizar de forma interactiva y optimizada desde su dispositivo móvil las pautas dietéticas detalladas por su nutricionista.
* **Actores:** A1: Paciente.
* **Actor Iniciador:** A1: Paciente.
* **Precondición:** El paciente debe contar con la app móvil instalada y autenticada, además de poseer un plan alimenticio activo en el sistema.
* **Flujo Principal:**
    1. El paciente abre la aplicación móvil React Native en su smartphone.
    2. La app móvil realiza una petición segura vía GraphQL directamente al Core NestJS solicitando la dieta vigente asociada a su ID de usuario autenticado.
    3. El Core valida el token de sesión, accede a PostgreSQL y extrae la estructura del menú correspondiente.
    4. La aplicación React Native procesa el payload de la respuesta y renderiza los alimentos ordenados de forma intuitiva según el día de la semana actual.
    5. El paciente navega fluidamente entre los diferentes días para revisar ingredientes, porciones y notas especiales de hidratación.
* **Post Condición:** El paciente visualiza correctamente su plan dietético diario en la interfaz táctil de su dispositivo móvil.
* **Excepción:**
    * *2.a. Inexistencia de planes asignados en el sistema:* La aplicación móvil despliega una pantalla informativa con un mensaje que indica que su nutricionista aún se encuentra diseñando su plan alimenticio.

#### Nombre de Caso de Uso: CU6: Autenticación y Control de Acceso Multi-Tenant
* **Propósito:** Proveer un mecanismo centralizado y seguro de validación de identidad para todos los actores, inyectando restricciones de aislamiento multi-tenant desde el inicio de la sesión.
* **Actores:** A1: Paciente, A2: Nutricionista, A3: Super Administrador.
* **Actor Iniciador:** A1: Paciente, A2: Nutricionista o A3: Super Administrador.
* **Precondición:** El usuario debe poseer una cuenta de acceso registrada previamente en los repositorios de VitalBite.
* **Flujo Principal:**
    1. El usuario abre la interfaz de acceso correspondiente (Panel web Angular para A2/A3, o Aplicación Móvil React Native para A1).
    2. El usuario introduce sus datos tradicionales (email/password) o, alternativamente, acciona el lector nativo de huella/identidad biométrica en el celular.
    3. El frontend emite la solicitud de autenticación estructurada al Core NestJS haciendo uso de la API de GraphQL.
    4. El Core NestJS valida la correspondencia de las credenciales de seguridad en PostgreSQL.
    5. El sistema detecta el rol del usuario y extrae de forma mandatoria el Tenant ID en caso de ser un perfil corporativo (Nutricionista).
    6. El Core genera un token firmado criptográficamente Json Web Token (JWT) que encapsula el ID de usuario, rol y el Tenant ID asignado de forma inalterable.
    7. El token es devuelto al cliente y el frontend redirige al usuario con éxito a su pantalla de bienvenida de inicio.
* **Post Condición:** Se establece un entorno de sesión protegido mediante un JWT que forzará el aislamiento de datos multi-tenant en cada consulta posterior de la plataforma.
* **Excepción:**
    * *4.a. Credenciales inválidas o falla de coincidencia de token biométrico:* El sistema rechaza el login, emite un mensaje de denegación de credenciales y bloquea el paso hacia las áreas internas.

---

### CICLO 2: CAPA DE INTELIGENCIA, AUTOMATIZACIÓN Y AUDITORÍA CRÍTICA

#### Nombre de Caso de Uso: CU7: Monitorear Evolución Física y Dashboard BI
* **Propósito:** Consolidar e ilustrar tableros analíticos e históricos gráficos que muestren la evolución física de los pacientes y los indicadores comerciales agregados del SaaS.
* **Actores:** A1: Paciente, A2: Nutricionista, A3: Super Administrador.
* **Actor Iniciador:** A1: Paciente, A2: Nutricionista o A3: Super Administrador.
* **Precondición:** Debe existir un volumen mínimo de datos operativos registrados históricamente en las bases del sistema para dar coherencia a las métricas del tablero.
* **Flujo Principal:**
    1. El usuario accede al menú de "Seguimiento y Dashboard BI" desde su interfaz cliente correspondiente.
    2. El frontend realiza solicitudes paralelas: consulta datos de evolución clínica al Core NestJS (PostgreSQL) y extrae métricas masivas agregadas guardadas en DynamoDB.
    3. El sistema unifica los flujos de datos recibidos y calcula las series de tiempo e indicadores macro.
    4. La plataforma renderiza los tableros interactivos adaptados estrictamente según el rol del actor autenticado:
        * **A1 (Paciente):** Gráficos visuales auto-explicativos sobre sus variaciones de peso, porcentaje graso y masa muscular a lo largo del tiempo.
        * **A2 (Nutricionista):** KPIs de tasa de asistencia a citas, cumplimiento general de dietas de sus pacientes y alertas consolidadas de riesgo nutricional de su tenant.
        * **A3 (Super Administrador):** Tableros analíticos globales de salud del SaaS: ingresos recurrentes mensuales (MRR), volumen de tenants activos y tasas de abandono.
* **Post Condición:** Los gráficos e indicadores clave de rendimiento son expuestos dinámicamente en pantalla respetando las fronteras multi-tenant.
* **Excepción:**
    * *2.a. Insuficiencia crítica de datos en el historial del consultorio:* El dashboard BI se dibuja correctamente pero carga marcadores de posición vacíos con guías operativas para incentivar el registro de información.

#### Nombre de Caso de Uso: CU8: Generar y Exportar Reporte Nutricional en PDF
* **Propósito:** Compilar de forma automatizada las métricas clínicas, evolutivas y pautas de menús de un paciente en un documento digital estructurado e imprimible de formato PDF.
* **Actores:** A2: Nutricionista.
* **Actor Iniciador:** A2: Nutricionista.
* **Precondición:** El paciente debe poseer registros de datos antropométricos e históricos cargados en el tenant del solicitante.
* **Flujo Principal:**
    1. El nutricionista presiona la opción "Exportar Reporte Nutricional PDF" dentro de la vista del expediente en Angular.
    2. El Core NestJS intercepta la orden y despacha una solicitud interna vía REST dirigida especialmente hacia el microservicio Documental implementado en Spring Boot.
    3. El componente Spring Boot extrae los datos necesarios del paciente, procesa las plantillas de diseño estéticas y genera el archivo binario PDF estructurado.
    4. Spring Boot carga el documento PDF resultante de forma directa en un contenedor persistente de objetos dentro de Amazon S3.
    5. Amazon S3 guarda el objeto y responde retornando una URL segura pre-firmada con una ventana temporal de expiración restrictiva.
    6. Spring Boot reenvía la URL segura pre-firmada al Core NestJS, el cual la transfiere de vuelta al panel web Angular.
    7. Angular descarga de forma automática el archivo en el almacenamiento local del nutricionista y **dispara asíncronamente el log de auditoría en Blockchain**.
* **Post Condición:** El reporte nutricional físico queda alojado de manera segura en un bucket de Amazon S3 y el profesional obtiene una URL temporal exclusiva para su descarga.
* **Excepción:**
    * *4.a. Falla de conexión o caída de los buckets de Amazon S3:* El microservicio Spring Boot intercepta la excepción del SDK de AWS, aborta la operación documental y notifica en Angular que el servicio de archivos no se encuentra disponible temporalmente.

#### Nombre de Caso de Uso: CU9: Analizar Etiquetas y Alimentos con Deep Learning
* **Propósito:** Ofrecer un asistente inteligente móvil capaz de reconocer mediante visión computacional la composición de platos preparados y extraer texto de etiquetas nutricionales mediante OCR para alertar de riesgos clínicos en tiempo real.
* **Actores:** A1: Paciente.
* **Actor Iniciador:** A1: Paciente.
* **Precondición:** La aplicación móvil React Native debe contar con los permisos nativos concedidos de acceso a la cámara de fotos del hardware móvil.
* **Flujo Principal:**
    1. El paciente ingresa al módulo "Analizar Alimento con IA" en la app móvil e inicia la cámara fotográfica.
    2. El paciente toma una instantánea clara de la tabla nutricional de un empaque comercial o de un plato de comida servido.
    3. La app móvil comprime el archivo de imagen y lo transmite mediante un payload binario directo hacia el microservicio de Inteligencia Artificial desarrollado en FastAPI.
    4. FastAPI procesa la imagen e invoca de forma asíncrona sus modelos entrenados de Deep Learning:
        * *Flujo de etiqueta:* Ejecuta algoritmos de Reconocimiento Óptico de Caracteres (OCR) abstrayendo las cadenas textuales de ingredientes y conservantes.
        * *Flujo de plato:* Corre redes neuronales de clasificación de imágenes detectando componentes alimenticios presentes en la comida.
    5. El servicio de FastAPI cruza los elementos identificados con el listado de alergias médicas y restricciones guardadas en el perfil de PostgreSQL del paciente.
    6. FastAPI empaqueta los resultados en un formato JSON ordenado detallando semáforos de advertencia sanitaria.
    7. La app móvil React Native interpreta el JSON y expone en pantalla las alertas visuales claras indicando si el alimento es seguro o de riesgo.
* **Post Condición:** El paciente obtiene un diagnóstico inmediato del riesgo de un alimento basado en el procesamiento de inteligencia artificial acoplado a su condición de salud.
* **Excepción:**
    * *4.a. Imagen capturada borrosa, sobreexpuesta o con nula visibilidad:* El motor FastAPI retorna un indicador de confianza inferior al percentil mínimo tolerado; la app detiene el flujo analítico e instruye al paciente a repetir la toma con mejor iluminación.

#### Nombre de Caso de Uso: CU10: Evaluar Predicción de Riesgo de Salud (Random Forest)
* **Propósito:** Ejecutar algoritmos predictivos de Machine Learning supervisado para inferir probabilísticamente la propensión de un paciente a sufrir descompensaciones o riesgos nutricionales a futuro.
* **Actores:** A2: Nutricionista.
* **Actor Iniciador:** A2: Nutricionista.
* **Precondición:** El expediente del paciente bajo análisis debe albergar una serie temporal de mediciones físicas y registro continuo de hábitos de vida en el sistema.
* **Flujo Principal:**
    1. El nutricionista hace clic en la opción "Ejecutar Predicción de Riesgo Clínico" en el panel de control del paciente en Angular.
    2. El Core NestJS recopila las variables relacionales del perfil (edad, variaciones de peso, curvas de IMC, conductas alimentarias registradas) y las envía al microservicio analítico FastAPI.
    3. El backend de FastAPI somete el vector de características al modelo matemático entrenado bajo la arquitectura de clasificadores **Random Forest (Bosques Aleatorios)**.
    4. El algoritmo evalúa las variables a través de sus árboles de decisión ponderados y calcula un porcentaje estimado de riesgo de salud (Bajo, Medio, Alto) junto a las causales críticas.
    5. FastAPI devuelve el payload de datos predictivos al Core NestJS, el cual asienta dicho hito analítico en las tablas históricas de PostgreSQL.
    6. El frontend de Angular refresca la vista del nutricionista ilustrando medidores de alerta gráficos y sugerencias clínicas preventivas automáticas.
* **Post Condición:** Un registro de estimación predictiva automatizada queda almacenado en PostgreSQL para el seguimiento evolutivo del expediente del paciente.
* **Excepción:**
    * *2.a. Datos de entrada insuficientes para alimentar las ramas del modelo predictivo:* El sistema bloquea el cálculo analítico y detalla al nutricionista qué métricas específicas o hábitos conductuales faltan ser completados en el expediente para poder habilitar la predicción.

#### Nombre de Caso de Uso: CU11: Consultar Segmentación de Perfiles (K-means)
* **Propósito:** Agrupar automáticamente a los pacientes de un consultorio mediante Machine Learning no supervisado para identificar patrones ocultos de conducta y optimizar tratamientos.
* **Actores:** A2: Nutricionista.
* **Actor Iniciador:** A2: Nutricionista.
* **Precondición:** El Tenant ID del nutricionista debe registrar una masa crítica de población de pacientes con datos antropométricos cargados para habilitar consistencia estadística.
* **Flujo Principal:**
    1. El nutricionista accede a la sección de "Análisis de Población y Perfiles de Pacientes" en la interfaz web de Angular.
    2. El cliente solicita al microservicio FastAPI la ejecución del procesamiento analítico de clustering masivo.
    3. FastAPI extrae de forma segura y anónima las coordenadas de composición corporal y conductas de los pacientes vinculados al Tenant ID solicitante.
    4. El motor de IA ejecuta el algoritmo **K-means (K-Medios)**, agrupando dinámicamente la muestra poblacional en clusters compactos definidos por proximidad a centroides óptimos.
    5. FastAPI retorna la matriz descriptiva de los grupos resultantes mapeando las características predominantes de cada segmento.
    6. El dashboard web Angular renderiza un gráfico tridimensional interactivo de dispersión de puntos donde el nutricionista puede aislar grupos y enfocar estrategias grupales.
* **Post Condición:** El nutricionista obtiene una categorización científica descriptiva de sus clientes de valor clínico avanzado, procesada en tiempo real.
* **Excepción:**
    * *3.a. Volumen de pacientes activos inferior al umbral mínimo requerido por el algoritmo:* El sistema suspende el cálculo matemático e indica visualmente cuántos expedientes adicionales es mandatorio registrar para poder activar el modelo estadístico de K-means.

#### Nombre de Caso de Uso: CU12: Automatizar Flujos de Citas y Notificaciones (n8n)
* **Propósito:** Coordinar flujos asíncronos automáticos orientados al control de citas médicas interactuando con los pacientes mediante canales conversacionales externos (WhatsApp).
* **Actores:** A1: Paciente, A2: Nutricionista.
* **Actor Iniciador:** El Sistema (por temporizador) o el Paciente (vía WhatsApp).
* **Precondición:** El paciente debe registrar un número telefónico válido en su ficha de PostgreSQL y el motor de flujos n8n debe encontrarse en estado operativo activo.
* **Flujo Principal:**
    1. El motor de automatizaciones **n8n** detecta el cumplimiento de un disparador configurado (sea un temporizador de citas de las próximas 24 horas o un webhook de entrada).
    2. **Paso 1 del Flujo:** n8n emite una petición automatizada hacia la API externa de WhatsApp enviándole un mensaje estructurado con botones de confirmación ("SI / NO") al celular del paciente.
    3. El paciente visualiza la alerta interactiva en su teléfono móvil y presiona una de las respuestas de confirmación de asistencia.
    4. **Paso 2 del Flujo:** La pasarela intercepta la respuesta del dispositivo y dispara un webhook de retorno a n8n, el cual invoca mutaciones de GraphQL directamente al Core NestJS para actualizar el estado de la cita a "Confirmada" o "Cancelada" en PostgreSQL.
    5. **Paso 3 del Flujo:** El sistema procesa la actualización de datos transaccionales, y n8n despacha en background un correo electrónico confirmatorio de vuelta al paciente junto a una notificación web en tiempo real en la pantalla Angular del nutricionista.
* **Post Condición:** El estado operativo de la agenda en la base de datos PostgreSQL se sincroniza y actualiza automáticamente sin requerir intervención de personal administrativo.
* **Excepción:**
    * *4.a. El paciente redacta una cadena de texto ambigua que rompe las reglas lógicas del bot:* El flujo secundario de n8n atrapa la anomalía conversacional y reenvía un mensaje aclaratorio guiado con opciones fijas para reencauzar la confirmación automática.

#### Nombre de Caso de Uso: CU13: Auditar Integridad de Eventos Críticos (Blockchain)
* **Propósito:** Proporcionar una bitácora inmutable de auditoría forense para certificar el no repudio, transparencia e integridad absoluta de las operaciones de alta criticidad en la plataforma.
* **Actores:** A3: Super Administrador.
* **Actor Iniciador:** El Sistema (disparo automatizado transparente de fondo).
* **Precondición:** Una transacción catalogada previamente como crítica por el negocio (modificaciones de expedientes, cambios de estado financieros o alteraciones de suscripciones) debe haber sido completada con éxito en el Core.
* **Flujo Principal:**
    1. El Core NestJS consolida una transacción crítica dentro de sus procesos (Ej: el reporte de un cobro completado por el servicio de pagos en .NET).
    2. El sistema empaqueta los metadatos constitutivos de la acción: identificador único del usuario operador, marca de tiempo ISO, ID del recurso modificado y el estado final.
    3. El microservicio Documental y de Auditoría en Spring Boot intercepta el payload y calcula un hash criptográfico determinista e inalterable aplicando el algoritmo robusto SHA-256.
    4. El componente Spring Boot interactúa con la infraestructura de **Blockchain** a nivel de registro, insertando en el ledger inmutable el hash calculado, el timestamp y la firma del bloque inmediatamente anterior.
    5. Los metadatos mínimos descriptivos de la transacción se almacenan paralelamente en PostgreSQL como enlace testigo del log corporativo.
    6. El Super Administrador (A3) accede al panel web Angular de auditoría forense, visualizando la bitácora cronológica con indicadores de semáforo verde que certifican matemáticamente la integridad de los datos frente a alteraciones maliciosas.
* **Post Condición:** La firma criptográfica de la transacción queda inyectada permanentemente en la cadena de bloques blockchain, garantizando su inmutabilidad histórica.
* **Excepción:**
    * *4.a. Pérdida de conectividad o falla crítica con los nodos de la red blockchain:* El microservicio Spring Boot desvía el log hacia una cola persistente de contingencia local activa y enciende una alarma visual de advertencia silenciosa en el dashboard de administración central.

#### Nombre de Caso de Uso: CU14: Gestionar Ofertas de Planes y Suscripciones SaaS
* **Propósito:** Facultar al administrador del ecosistema para dictaminar, actualizar o suspender la matriz de ofertas comerciales, costos de suscripciones y cuotas operativas permitidas a los tenants clínicos.
* **Actores:** A3: Super Administrador.
* **Actor Iniciador:** A3: Super Administrador.
* **Precondición:** El operador debe estar autenticado con el nivel jerárquico máximo de Super Administrador en el panel web global Angular.
* **Flujo Principal:**
    1. El Super Administrador se dirige al apartado de "Configuración de Planes SaaS" en la consola web administrativa de Angular.
    2. El frontend web ejecuta llamadas directas hacia el microservicio especializado de Pagos desarrollado sobre la arquitectura **.NET (desplegado en Azure)**.
    3. El servicio en .NET consulta de manera atómica el catálogo comercial disponible leyendo las tablas de la base de datos NoSQL de alta velocidad **DynamoDB**.
    4. El Super Administrador selecciona un esquema (Ej: "Plan Avanzado") y altera los valores de negocio de la oferta: costo mensual en dólares, tope de pacientes permitidos en paralelo y cuota límite de almacenamiento de PDFs en S3.
    5. El Super Administrador presiona el botón "Actualizar Oferta de Suscripción".
    6. El microservicio en .NET valida la estructura del objeto de datos y reescribe el registro documental en la colección de **DynamoDB**.
    7. El panel Angular confirma el cambio y actualiza el tarifario global del SaaS para potenciales nuevas afiliaciones.
* **Post Condición:** Los topes y condiciones de suscripción se actualizan de forma inmediata en la base NoSQL DynamoDB, alterando las reglas de validación operativas de los consultorios.
* **Excepción:**
    * *4.a. Intento de reducir los límites de un plan por debajo del consumo de datos real de tenants activos:* El backend en .NET deniega la edición comercial emitiendo una alerta para impedir que consultorios en producción queden congelados o rompan sus cuotas operativas actuales.

#### Nombre de Caso de Uso: CU15: Conciliar Pagos y Facturación Global
* **Propripción:** Automatizar e inspeccionar el flujo de recaudación de capital por cargos recurrentes mensuales, procesando las respuestas de pasarelas de pago externas y extendiendo las licencias operativas de los consultorios afiliados.
* **Actores:** A3: Super Administrador.
* **Actor Iniciador:** Evento de pasarela de pagos externa (vía Webhook) o A3: Super Administrador.
* **Precondición:** El tenant clínico debe registrar un método de pago bancario enlazado en su cuenta y el microservicio financiero estar a la escucha de eventos externos.
* **Flujo Principal:**
    1. Al cumplirse la fecha de vencimiento del ciclo de facturación de un tenant, la pasarela de pagos emite una notificación automatizada (Webhook de Pago Exitoso) hacia el servidor de VitalBite.
    2. El microservicio financiero implementado en **.NET (Azure)** intercepta el webhook y valida la legitimidad de las firmas criptográficas de la entidad financiera emisora.
    3. El componente .NET calcula los balances, genera la factura contable digital y extiende de manera automática el tiempo de vigencia de la suscripción del tenant.
    4. El microservicio asienta de forma cronológica el historial del cobro exitoso dentro de la base de datos NoSQL analítica **DynamoDB**.
    5. El Super Administrador (A3) accede al panel de "Finanzas y Conciliación" en Angular para monitorizar las métricas de ingresos recolectados.
    6. El sistema despliega el consolidado de transacciones exitosas, permitiendo auditar la concordancia entre los depósitos bancarios reales y los accesos a la plataforma liberados.
* **Post Condición:** El historial contable y financiero se graba de forma definitiva en DynamoDB y el consultorio del nutricionista extiende sus accesos de uso en el software por un nuevo periodo comercial.
* **Excepción:**
    * *2.a. Webhook reporta cobro rechazado por fondos insuficientes o tarjeta de crédito expirada:* El microservicio .NET intercepta el fallo financiero, altera en DynamoDB el estado del tenant a "Suspendido por Mora", inhabilita temporalmente sus credenciales operativas de edición de datos y despacha un correo de alerta instructivo al nutricionista para regularizar su cuenta.

---

## 4. Notas de Implementación y Restricciones del Examen

1.  **Protocolo de Comunicación Principal:** Todos los casos de uso accesibles desde los canales cliente (Web Angular y Móvil React Native) interactúan obligatoriamente con el Core NestJS haciendo uso del lenguaje de consultas **GraphQL**. El uso de arquitecturas **REST se prohíbe como canal principal** y queda restringido exclusivamente para la intercomunicación interna síncrona entre el Core y los microservicios especializados de soporte (.NET, Spring Boot y FastAPI).
2.  **Aislamiento Multi-Tenant Mandatorio:** Los casos de uso transaccionales y clínicos del Ciclo 1 (**CU1, CU2, CU3, CU4**) deben inyectar e interceptar obligatoriamente el parámetro `TenantID` a nivel de base de datos relacional (**PostgreSQL**) para impedir de forma absoluta la fuga de información clínica o visibilidad cruzada de registros entre consultorios médicos competidores.
3.  **Encadenamiento Estadístico de IA:** Los casos de uso de inteligencia artificial y analítica avanzada del Ciclo 2 (**CU9, CU10, CU11**) están condicionados por el historial de datos acumulados en el **CU3 (Medidas corporales)**. Los algoritmos predictivos y clasificatorios no pueden ejecutarse de forma aislada si el expediente relacional del paciente carece de información antropométrica de origen.
4.  **Disparadores de Bitácora Inmutable (Blockchain):** El caso de uso **CU13 (Blockchain)** no cuenta con un botón de ejecución directa por usuarios comunes; se concibe como un disparador background del sistema automatizado que intercepta de forma mandatoria la finalización exitosa de los casos de uso **CU4** (cambios en dietas), **CU8** (acceso y generación documental) y **CU15** (transacciones de pago aprobadas por .NET).
5.  **Persistencia Políglota Separada:** El dominio transaccional clínico descansa firmemente sobre **PostgreSQL/Supabase** (Core NestJS), mientras que todo el volumen analítico, historial de facturaciones, estados de suscripción corporativos e indicadores comerciales de alta velocidad residen aislados en la base NoSQL **DynamoDB** gestionada por el microservicio en .NET, garantizando la escalabilidad y la defensa académica exigida en el examen.