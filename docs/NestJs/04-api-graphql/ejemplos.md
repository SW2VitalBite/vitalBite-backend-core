# Ejemplos GraphQL

Los ejemplos muestran la forma esperada de consumo del Core. Los nombres pueden ajustarse durante implementación, pero deben conservar separación por tenant, roles y responsabilidades.

## Health

```graphql
query {
  health
}
```

## Login conceptual

```graphql
mutation {
  login(input: { email: "admin@vitalbite.com", password: "secret" }) {
    accessToken
    user {
      id
      email
      role {
        code
      }
      tenantId
    }
  }
}
```

## Consultar usuario autenticado

```graphql
query {
  me {
    id
    email
    firstName
    lastName
    tenantId
    role {
      code
      permissions {
        code
      }
    }
  }
}
```

## Crear paciente

```graphql
mutation {
  createPatient(input: {
    firstName: "Ana"
    lastName: "García"
    email: "ana@example.com"
    phone: "+59170000000"
    birthDate: "1998-04-15T00:00:00Z"
    gender: FEMALE
    nutritionGoal: "Reducir grasa corporal"
    clinicalNotes: "Sin alergias declaradas"
  }) {
    id
    firstName
    lastName
    status
  }
}
```

## Listar pacientes por nutricionista

```graphql
query {
  patients(filter: {
    status: ACTIVE
    search: "Ana"
  }) {
    id
    firstName
    lastName
    nutritionGoal
    status
  }
}
```

## Agendar cita

```graphql
mutation {
  createAppointment(input: {
    patientId: "patient-id"
    nutritionistId: "nutritionist-id"
    scheduledAt: "2026-06-02T10:00:00Z"
    durationMinutes: 45
    reason: "Control nutricional"
  }) {
    id
    status
    scheduledAt
  }
}
```

## Consultar calendario

```graphql
query {
  appointmentsCalendar(filter: {
    dateFrom: "2026-06-01T00:00:00Z"
    dateTo: "2026-06-30T23:59:59Z"
    status: CONFIRMED
  }) {
    id
    scheduledAt
    status
    patient {
      id
      firstName
      lastName
    }
  }
}
```

## Registrar medida corporal

```graphql
mutation {
  createBodyMeasurement(input: {
    patientId: "patient-id"
    measuredAt: "2026-06-02T14:00:00Z"
    weightKg: 68.4
    heightCm: 165
    waistCm: 78
    hipCm: 96
  }) {
    id
    weightKg
    heightCm
    bmi
  }
}
```

## Registrar composición corporal

```graphql
mutation {
  createBodyComposition(input: {
    patientId: "patient-id"
    bodyMeasurementId: "measurement-id"
    measuredAt: "2026-06-02T14:10:00Z"
    bodyFatPercentage: 28.5
    muscleMassKg: 42.1
    waterPercentage: 51.2
    visceralFatLevel: 7
  }) {
    id
    bodyFatPercentage
    muscleMassKg
    waterPercentage
  }
}
```

## Crear seguimiento nutricional

```graphql
mutation {
  createTrackingEntry(input: {
    patientId: "patient-id"
    trackedAt: "2026-06-02T15:00:00Z"
    dietCompliancePercentage: 82
    observations: "Buena adherencia semanal"
    alerts: []
    progressStatus: IMPROVING
  }) {
    id
    progressStatus
    dietCompliancePercentage
  }
}
```

## Crear dieta

```graphql
mutation {
  createDiet(input: {
    patientId: "patient-id"
    name: "Plan hipocalórico inicial"
    objective: "Reducir grasa corporal"
    startDate: "2026-06-03T00:00:00Z"
    meals: [
      {
        name: "Desayuno"
        time: "08:00"
        order: 1
        items: [
          {
            foodName: "Avena"
            portion: "50g"
            calories: 190
            proteins: 6
            carbs: 32
            fats: 4
          }
        ]
      }
    ]
  }) {
    id
    name
    status
    meals {
      name
      items {
        foodName
        portion
      }
    }
  }
}
```

## Solicitar PDF de dieta

```graphql
mutation {
  requestDietPdf(dietId: "diet-id") {
    id
    status
    documentMetadata {
      id
      fileName
      downloadUrl
      expiresAt
    }
  }
}
```

## Consultar dashboard

```graphql
query {
  dashboardSummary(filter: {
    dateFrom: "2026-06-01T00:00:00Z"
    dateTo: "2026-06-30T23:59:59Z"
  }) {
    activePatients
    completedAppointments
    cancelledAppointments
    averageDietCompliance
    subscriptionIncome
  }
}
```

## Validación de suscripción vía Core → .NET

La validación de plan no se expone como CRUD de pagos en GraphQL. El Core consulta internamente al microservicio `.NET + DynamoDB` cuando una operación requiere validar límites del tenant.

Ejemplo de operación que puede requerir validación:

```graphql
mutation {
  createPatient(input: {
    firstName: "Luis"
    lastName: "Paz"
    email: "luis@example.com"
    nutritionGoal: "Aumentar masa muscular"
  }) {
    id
    status
  }
}
```

Si el tenant superó el límite de pacientes del plan, el Core debe responder con un error GraphQL controlado.
