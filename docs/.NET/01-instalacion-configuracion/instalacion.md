# Instalacion del microservicio de pagos

## Repositorio

El microservicio de pagos y suscripciones se crea como repositorio hermano:

```text
d:\SW2_Nutricion\vitalBite-backend-payments-dotnet
```

## Alcance V1

- Catalogo de planes.
- Suscripcion demo del tenant `clinica-central`.
- DynamoDB Local con tabla unica `VitalBitePayments`.
- Sin pagos reales ni cambios de plan.

## Requisitos

- .NET 10 SDK.
- Docker Desktop.

## Ejecucion local

Con Docker:

```powershell
cd d:\SW2_Nutricion\vitalBite-backend-payments-dotnet
docker compose up -d
dotnet restore
dotnet run --project src/VitalBite.Payments.Api
```

Sin Docker, usando DynamoDB Local descargado en `d:\SW2_Nutricion\dynamodb-local`:

```powershell
cd d:\SW2_Nutricion\dynamodb-local
mkdir data -Force
java "-Djava.library.path=./DynamoDBLocal_lib" -jar DynamoDBLocal.jar -sharedDb -dbPath ./data
```

En otra terminal:

```powershell
cd d:\SW2_Nutricion\vitalBite-backend-payments-dotnet
$env:ASPNETCORE_URLS="http://127.0.0.1:5100"
dotnet run --project src/VitalBite.Payments.Api
```

La API local queda en:

```text
http://localhost:5100
```

## Endpoints V1

- `GET /health`
- `GET /plans`
- `GET /tenants/{tenantId}/subscription`

## Integracion con Core

El frontend web no consume este servicio directamente. Angular consulta el Core mediante GraphQL y el Core llama internamente al microservicio .NET usando `PAYMENTS_SERVICE_URL`.
