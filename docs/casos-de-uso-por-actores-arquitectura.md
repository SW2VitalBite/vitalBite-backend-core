# Casos de uso por actores y arquitectura

Documento derivado del flujo de captura de requisitos. Agrupa los casos de uso del sistema por actor, indica la plataforma de cada uno y el impacto en la arquitectura tecnológica.

## Resumen

| Actor | Plataforma | Casos de uso |
|-------|------------|--------------|
| Nutricionista | Aplicación web (Angular) | CU_N01 – CU_N09 |
| Paciente | App móvil (React Native) + WhatsApp | CU_P01 – CU_P07 |
| Super administrador | Panel web Angular (módulo exclusivo) | CU_S01 – CU_S04 |

---

## 1. Nutricionista

**Plataforma:** Aplicación web (Angular)

**Propósito:** Gestión clínica, diseño de estrategias nutricionales y consulta de análisis avanzados de datos.

| ID | Caso de uso | Descripción | Impacto en arquitectura |
|----|-------------|-------------|-------------------------|
| **CU_N01** | Gestionar expediente de pacientes | El nutricionista registra, modifica o consulta la ficha técnica de un paciente, incluyendo datos básicos, antecedentes y alergias alimentarias. | NestJS · PostgreSQL |
| **CU_N02** | Gestionar control de citas médicas | Visualizar el calendario, agendar citas de forma manual, reprogramar o cancelar las existentes. | NestJS · PostgreSQL |
| **CU_N03** | Registrar medidas y composición corporal | Durante la consulta, introduce datos antropométricos (perímetros de brazo, abdomen, pierna, etc.) y valores de bioimpedancia. | NestJS · PostgreSQL |
| **CU_N04** | Monitorear evolución física del paciente | Tablero visual con gráficas evolutivas de IMC, porcentaje de grasa corporal, grasa visceral, masa muscular y retención de agua del paciente seleccionado. | NestJS · PostgreSQL |
| **CU_N05** | Diseñar y asignar planes dietéticos | Estructura menús diarios (desayuno, almuerzo, cena, colaciones) asignando porciones y alimentos específicos al paciente. | NestJS · PostgreSQL |
| **CU_N06** | Generar y exportar reporte nutricional en PDF | El sistema compila la dieta actual y los gráficos de progreso en un PDF formal, disponible para descarga y envío automático. | NestJS · PostgreSQL |
| **CU_N07** | Consultar predicción de riesgo de salud (ML supervisado) | Evaluación predictiva basada en el histórico del paciente para identificar riesgos potenciales (p. ej. diabetes o hipertensión). | FastAPI · MongoDB · Random Forest |
| **CU_N08** | Consultar segmentación de perfiles clínicos (ML no supervisado) | Visualización de cómo están agrupados los pacientes según patrones de comportamiento o complexión física, para diseñar estrategias grupales. | FastAPI · MongoDB · K-Means |
| **CU_N09** | Gestionar estado de suscripción del tenant | Consulta del plan de pago, facturas emitidas por la plataforma y límites de uso de la cuenta. | Spring Boot · DynamoDB |

### Detalle por caso de uso

#### CU_N01: Gestionar expediente de pacientes

El nutricionista registra, modifica o consulta la ficha técnica de un paciente, incluyendo sus datos básicos, antecedentes y alergias alimentarias.

- **Stack:** NestJS, PostgreSQL

#### CU_N02: Gestionar control de citas médicas

Permite al especialista visualizar su calendario, agendar nuevas citas de forma manual, reprogramar o cancelar las existentes.

- **Stack:** NestJS, PostgreSQL

#### CU_N03: Registrar medidas y composición corporal

Durante la consulta, el nutricionista introduce los datos antropométricos del paciente (perímetros de brazo, abdomen, pierna, etc.) y los valores de bioimpedancia.

- **Stack:** NestJS, PostgreSQL

#### CU_N04: Monitorear evolución física del paciente

Despliega un tablero visual con gráficas evolutivas sobre el IMC, porcentaje de grasa corporal, grasa visceral, masa muscular y retención de agua del paciente seleccionado.

- **Stack:** NestJS, PostgreSQL

#### CU_N05: Diseñar y asignar planes dietéticos

El especialista estructura los menús diarios (desayuno, almuerzo, cena, colaciones) asignando las porciones y alimentos específicos para el paciente.

- **Stack:** NestJS, PostgreSQL

#### CU_N06: Generar y exportar reporte nutricional en PDF

El sistema compila automáticamente la dieta actual y los gráficos de progreso en un documento PDF formal, el cual queda disponible para su descarga y envío automático.

- **Stack:** NestJS, PostgreSQL

#### CU_N07: Consultar predicción de riesgo de salud (ML supervisado)

El nutricionista solicita al sistema una evaluación predictiva basada en el histórico del paciente para identificar riesgos potenciales de salud (como propensión a diabetes o hipertensión).

- **Stack:** FastAPI, MongoDB, Random Forest

#### CU_N08: Consultar segmentación de perfiles clínicos (ML no supervisado)

El especialista visualiza en su panel cómo están agrupados sus pacientes según patrones de comportamiento o complexión física comunes, ayudándole a diseñar estrategias grupales eficaces.

- **Stack:** FastAPI, MongoDB, K-Means

#### CU_N09: Gestionar estado de suscripción del tenant

El nutricionista visualiza el estado actual de su plan de pago, las facturas emitidas por la plataforma y los límites de uso de su cuenta.

- **Stack:** Spring Boot, DynamoDB

---

## 2. Paciente

**Plataforma:** Aplicación móvil (React Native) + asistente automatizado (WhatsApp)

**Propósito:** Autogestión del plan nutricional, registro de hábitos en tiempo real e interacción ágil con el servicio.

| ID | Caso de uso | Descripción | Impacto en arquitectura |
|----|-------------|-------------|-------------------------|
| **CU_P01** | Visualizar plan alimenticio asignado | Revisar desde el móvil la dieta detallada, horarios de comida e indicaciones del nutricionista. | React Native · NestJS |
| **CU_P02** | Registrar reporte de consumo diario | Marcar alimentos consumidos a lo largo del día para contrastarlos con la dieta y registrar el apego al plan. | React Native · NestJS |
| **CU_P03** | Consultar historial de progreso personal | Evolución de mediciones físicas y peso mediante gráficos interactivos en el teléfono. | React Native · NestJS |
| **CU_P04** | Analizar etiqueta nutricional por imagen (OCR) | Fotografía de la tabla nutricional de un producto; el sistema extrae textos e indica si es apto según alergias y restricciones. | React Native · FastAPI · MongoDB |
| **CU_P05** | Clasificar plato de comida por fotografía (deep learning) | Foto de comida preparada; análisis visual del plato, identificación de ingredientes y estimación de macronutrientes. | React Native · FastAPI · MongoDB |
| **CU_P06** | Solicitar agendamiento de cita (app móvil) | Buscar espacios disponibles en la agenda del nutricionista y reservar un cupo desde la aplicación. | React Native · NestJS |
| **CU_P07** | Gestionar cita vía mensajería (bot de WhatsApp) | Consultar, confirmar o cancelar la próxima cita por mensaje de texto sin abrir la app móvil. | Bot WhatsApp · NestJS |

### Detalle por caso de uso

#### CU_P01: Visualizar plan alimenticio asignado

El paciente accede desde su dispositivo móvil para revisar la dieta detallada, los horarios de comida y las indicaciones recetadas por su nutricionista.

- **Stack:** React Native, NestJS

#### CU_P02: Registrar reporte de consumo diario

El paciente marca los alimentos consumidos a lo largo del día para contrastarlos con la dieta asignada y registrar su nivel de apego al plan.

- **Stack:** React Native, NestJS

#### CU_P03: Consultar historial de progreso personal

El usuario visualiza la evolución de sus mediciones físicas y peso a través de gráficos interactivos desde la comodidad de su teléfono.

- **Stack:** React Native, NestJS

#### CU_P04: Analizar etiqueta nutricional por imagen (deep learning — OCR)

El paciente toma una fotografía a la tabla nutricional de cualquier producto comercial; el sistema extrae los textos y le indica si es apto o no según sus alergias y restricciones registradas.

- **Stack:** React Native, FastAPI, MongoDB

#### CU_P05: Clasificar plato de comida por fotografía (deep learning)

El paciente sube una foto de su comida preparada; el sistema analiza visualmente el plato, identifica los ingredientes principales y estima la distribución de macronutrientes.

- **Stack:** React Native, FastAPI, MongoDB

#### CU_P06: Solicitar agendamiento de cita (app móvil)

Permite al paciente buscar espacios disponibles en la agenda de su nutricionista y reservar un cupo directamente desde la aplicación.

- **Stack:** React Native, NestJS

#### CU_P07: Gestionar cita vía mensajería (bot de WhatsApp)

El paciente envía un mensaje de texto para consultar, confirmar o cancelar su próxima cita médica sin necesidad de abrir la aplicación móvil.

- **Stack:** Bot WhatsApp, NestJS

---

## 3. Super administrador

**Plataforma:** Panel de administración web (Angular — módulo exclusivo)

**Propósito:** Gobierno global del ecosistema SaaS, control comercial y auditoría de seguridad.

| ID | Caso de uso | Descripción | Impacto en arquitectura |
|----|-------------|-------------|-------------------------|
| **CU_S01** | Monitorear actividad de tenants (nutricionistas) | Panel global con el estado operativo de los distintos consultorios registrados en la plataforma. | Spring Boot · DynamoDB |
| **CU_S02** | Gestionar oferta de planes de suscripción | Crear planes, modificar precios, establecer pasarelas de pago y definir límites de uso (p. ej. máximo de pacientes). | Spring Boot · DynamoDB |
| **CU_S03** | Conciliar pagos y facturación global | Registro centralizado de transacciones financieras, cobros mensuales recurrentes y emisión de facturas. | Spring Boot · DynamoDB |
| **CU_S04** | Auditar transacciones e inmutabilidad (blockchain) | Verificación de que los registros de auditoría y los hashes de pagos no hayan sido alterados, cruzando información con la red distribuida. | Spring Boot · DynamoDB · Blockchain |

### Detalle por caso de uso

#### CU_S01: Monitorear actividad de tenants (nutricionistas)

El administrador visualiza un panel global con el estado operativo de los distintos consultorios registrados en la plataforma.

- **Stack:** Spring Boot, DynamoDB

#### CU_S02: Gestionar oferta de planes de suscripción

Permite crear, modificar precios, establecer pasarelas de pago y definir los límites de uso (ej. máximo de pacientes permitidos) para cada nivel de suscripción.

- **Stack:** Spring Boot, DynamoDB

#### CU_S03: Conciliar pagos y facturación global

El sistema despliega el registro centralizado de transacciones financieras, cobros mensuales recurrentes y emisión de facturas.

- **Stack:** Spring Boot, DynamoDB

#### CU_S04: Auditar transacciones e inmutabilidad (blockchain)

El administrador ejecuta herramientas de verificación para validar que los registros de auditoría de seguridad y los hashes de los pagos no hayan sido alterados, cruzando la información con la red distribuida.

- **Stack:** Spring Boot, DynamoDB, Blockchain

---

## Mapa de arquitectura por stack

| Stack / tecnología | Casos de uso |
|--------------------|--------------|
| **NestJS + PostgreSQL** | CU_N01 – CU_N06 |
| **FastAPI + MongoDB** | CU_N07, CU_N08, CU_P04, CU_P05 |
| **Spring Boot + DynamoDB** | CU_N09, CU_S01 – CU_S03 |
| **React Native + NestJS** | CU_P01 – CU_P03, CU_P06 |
| **Bot WhatsApp + NestJS** | CU_P07 |
| **Blockchain** | CU_S04 (además de Spring Boot y DynamoDB) |
