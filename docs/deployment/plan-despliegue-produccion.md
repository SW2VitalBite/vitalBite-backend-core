# Plan de Despliegue a Producción — VitalBite

**Versión:** 1.0  
**Fecha:** Junio 2026  
**Estado:** Producción Lista

---

## Índice

1. [Visión general de la arquitectura multi-cloud](#1-visión-general-de-la-arquitectura-multi-cloud)
2. [Inventario de servicios y destinos de despliegue](#2-inventario-de-servicios-y-destinos-de-despliegue)
3. [Prerrequisitos globales](#3-prerrequisitos-globales)
4. [Fase 1 — Base de datos PostgreSQL en Supabase](#4-fase-1--base-de-datos-postgresql-en-supabase)
5. [Fase 2 — Infraestructura AWS (S3, DynamoDB, Core, Frontend)](#5-fase-2--infraestructura-aws-s3-dynamodb-core-frontend)
   - 5.1 [Amazon S3](#51-amazon-s3)
   - 5.2 [Amazon DynamoDB](#52-amazon-dynamodb)
   - 5.3 [Backend Core NestJS (ECS Fargate)](#53-backend-core-nestjs--ecs-fargate)
   - 5.4 [Frontend Angular (S3 + CloudFront)](#54-frontend-angular--s3--cloudfront)
6. [Fase 3 — Backend IA en Google Cloud](#6-fase-3--backend-ia-en-google-cloud)
7. [Fase 4 — Backend Pagos .NET en Azure](#7-fase-4--backend-pagos-net-en-azure)
8. [Fase 5 — Backend Gestión Documental en DigitalOcean](#8-fase-5--backend-gestión-documental-en-digitalocean)
9. [Variables de entorno por servicio](#9-variables-de-entorno-por-servicio)
10. [Comunicación entre microservicios](#10-comunicación-entre-microservicios)
11. [Seguridad y networking](#11-seguridad-y-networking)
12. [Orden de despliegue recomendado](#12-orden-de-despliegue-recomendado)
13. [Verificación y smoke tests](#13-verificación-y-smoke-tests)
14. [Rollback](#14-rollback)

---

## 1. Visión general de la arquitectura multi-cloud

VitalBite es una plataforma SaaS de nutrición compuesta por seis servicios independientes distribuidos en cuatro proveedores de nube. La comunicación principal entre clientes y el Core es GraphQL; los microservicios internos se comunican con el Core vía REST/HTTP.

```
┌─────────────────────────────────────────────────────────────────────┐
│                        CLIENTES                                     │
│  Angular (AWS CloudFront)          React Native (Expo / stores)     │
└────────────────────┬────────────────────────────────────────────────┘
                     │  GraphQL (HTTPS)
┌────────────────────▼────────────────────────────────────────────────┐
│              AWS — Core NestJS (ECS Fargate)                        │
│  Dominio: api.vitalbite.com  │  Puerto 3000  │  GraphQL + REST      │
│                                                                      │
│  ┌─────────────┐  ┌──────────────┐  ┌──────────────────────────┐   │
│  │ PostgreSQL  │  │   DynamoDB   │  │        Amazon S3         │   │
│  │  Supabase   │  │  (AWS)       │  │  (documentos / imágenes) │   │
│  └─────────────┘  └──────────────┘  └──────────────────────────┘   │
└──────┬────────────────────┬────────────────────┬────────────────────┘
       │ REST               │ REST               │ REST
┌──────▼──────┐    ┌────────▼────────┐    ┌──────▼──────────────────┐
│ Google Cloud│    │     Azure       │    │     DigitalOcean        │
│ Backend IA  │    │ Backend Pagos   │    │ Backend Documental      │
│  FastAPI    │    │    .NET 10      │    │   Spring Boot 4         │
│ :8001       │    │    :5100        │    │    :8082                │
└─────────────┘    └─────────────────┘    └─────────────────────────┘
```

---

## 2. Inventario de servicios y destinos de despliegue

| Servicio | Tecnología | Nube / Servicio | URL / Dominio sugerido |
|---|---|---|---|
| Frontend Web | Angular 20 | AWS S3 + CloudFront | `app.vitalbite.com` |
| Backend Core | NestJS 11 + GraphQL | AWS ECS Fargate | `api.vitalbite.com/graphql` |
| Base de datos principal | PostgreSQL | Supabase (managed) | connection string Supabase |
| Almacenamiento objetos | Amazon S3 | AWS S3 | `vitalbite-docs.s3.amazonaws.com` |
| Base de datos pagos | DynamoDB | AWS DynamoDB | endpoint AWS regional |
| Backend IA / ML | FastAPI + Python 3.11 | Google Cloud Run | `ia.vitalbite.com` |
| Backend Pagos | .NET 10 minimal API | Azure Container Apps | `pagos.vitalbite.com` |
| Backend Documental | Spring Boot 4 / Java 21 | DigitalOcean App Platform | `docs.vitalbite.com` |

---

## 3. Prerrequisitos globales

### Cuentas y accesos
- [ ] Cuenta AWS activa con permisos IAM para ECS, ECR, S3, DynamoDB, CloudFront, Route 53, ACM.
- [ ] Proyecto en Google Cloud Platform con facturación habilitada y Cloud Run API activa.
- [ ] Suscripción Azure con permisos para Container Apps, ACR (Azure Container Registry).
- [ ] Cuenta DigitalOcean con App Platform habilitado y Container Registry.
- [ ] Organización Supabase con proyecto Pro (para `pgbouncer` en producción).

### Herramientas locales
- Docker 24+ con `docker buildx` (para imágenes multi-plataforma `linux/amd64`).
- AWS CLI v2 configurado (`aws configure`).
- `gcloud` CLI autenticado (`gcloud auth login`).
- Azure CLI (`az login`).
- `doctl` DigitalOcean CLI autenticado.
- `supabase` CLI instalado.
- Node.js 20 LTS, Java 21, Python 3.11, .NET 10 SDK, Expo CLI.

### Dominios y certificados
- Dominio `vitalbite.com` registrado (o equivalente) con DNS administrado en Route 53 o similar.
- Certificados TLS/SSL gestionados vía AWS ACM (CloudFront/ALB), Google-managed (Cloud Run), Azure-managed (Container Apps) y Let's Encrypt (DigitalOcean App Platform).

---

## 4. Fase 1 — Base de datos PostgreSQL en Supabase

Supabase debe estar lista antes de desplegar el Core, ya que es la base de datos principal.

### 4.1 Crear proyecto Supabase

1. Ingresar a [supabase.com](https://supabase.com) → **New project**.
2. Elegir región más cercana a la región AWS usada (ej. `us-east-1` → región Supabase `us-east-1`).
3. Anotar los siguientes valores desde **Settings → Database**:
   - `DB_HOST` (connection pooler con pgbouncer recomendado para producción)
   - `DB_PORT` (5432 directo / 6543 con pgbouncer)
   - `DB_NAME`
   - `DB_USER`
   - `DB_PASSWORD`

### 4.2 Aplicar migraciones Prisma

```bash
# Desde vitalBite-backend-core/
export DATABASE_URL="postgresql://USER:PASSWORD@HOST:PORT/DB_NAME?schema=public"
npx prisma migrate deploy     # Aplica todas las migraciones pendientes
npx prisma db seed            # Carga datos iniciales (tenants, roles, admin)
```

### 4.3 Configurar Row Level Security (RLS)

Si se usa RLS de Supabase (opcional, ya que el Core valida multi-tenant a nivel aplicación):

- Deshabilitar RLS en las tablas gestionadas por Prisma (el Core controla acceso por `tenantId`).
- Habilitar solo en tablas que se consuman directamente vía Supabase Client (si aplica).

### 4.4 Validación

```sql
-- Conectar vía Supabase SQL Editor
SELECT COUNT(*) FROM "User";
SELECT COUNT(*) FROM "Tenant";
```

---

## 5. Fase 2 — Infraestructura AWS (S3, DynamoDB, Core, Frontend)

### 5.1 Amazon S3

Bucket para almacenamiento de documentos PDF, imágenes OCR y reportes generados por Spring Boot.

```bash
# Crear bucket
aws s3api create-bucket \
  --bucket vitalbite-docs \
  --region us-east-1 \
  --create-bucket-configuration LocationConstraint=us-east-1

# Bloquear acceso público (Spring Boot generará URLs prefirmadas)
aws s3api put-public-access-block \
  --bucket vitalbite-docs \
  --public-access-block-configuration \
    BlockPublicAcls=true,IgnorePublicAcls=true,BlockPublicPolicy=true,RestrictPublicBuckets=true

# Configurar CORS (para acceso desde Angular/React Native vía URLs prefirmadas)
aws s3api put-bucket-cors --bucket vitalbite-docs --cors-configuration '{
  "CORSRules": [{
    "AllowedHeaders": ["*"],
    "AllowedMethods": ["GET", "PUT", "POST"],
    "AllowedOrigins": ["https://app.vitalbite.com"],
    "MaxAgeSeconds": 3000
  }]
}'

# Política de ciclo de vida (eliminar temporales de OCR tras 7 días)
aws s3api put-bucket-lifecycle-configuration \
  --bucket vitalbite-docs \
  --lifecycle-configuration file://s3-lifecycle.json
```

**Política IAM mínima para Spring Boot:**
```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Allow",
      "Action": ["s3:GetObject", "s3:PutObject", "s3:DeleteObject", "s3:GeneratePresignedUrl"],
      "Resource": "arn:aws:s3:::vitalbite-docs/*"
    }
  ]
}
```

### 5.2 Amazon DynamoDB

Tabla única `VitalBitePayments` para el microservicio .NET de pagos.

```bash
# Crear tabla principal
aws dynamodb create-table \
  --table-name VitalBitePayments \
  --attribute-definitions \
    AttributeName=PK,AttributeType=S \
    AttributeName=SK,AttributeType=S \
  --key-schema \
    AttributeName=PK,KeyType=HASH \
    AttributeName=SK,KeyType=RANGE \
  --billing-mode PAY_PER_REQUEST \
  --region us-east-1

# Crear índice secundario global para consultas por tenantId
aws dynamodb update-table \
  --table-name VitalBitePayments \
  --attribute-definitions \
    AttributeName=tenantId,AttributeType=S \
    AttributeName=createdAt,AttributeType=S \
  --global-secondary-index-updates '[
    {
      "Create": {
        "IndexName": "tenantId-createdAt-index",
        "KeySchema": [
          {"AttributeName": "tenantId", "KeyType": "HASH"},
          {"AttributeName": "createdAt", "KeyType": "RANGE"}
        ],
        "Projection": {"ProjectionType": "ALL"}
      }
    }
  ]' \
  --region us-east-1
```

**Variables de entorno para .NET:**
```
DynamoDB__ServiceURL=https://dynamodb.us-east-1.amazonaws.com
DynamoDB__Region=us-east-1
DynamoDB__TableName=VitalBitePayments
AWS_ACCESS_KEY_ID=<iam-access-key>
AWS_SECRET_ACCESS_KEY=<iam-secret-key>
DynamoDB__SeedOnStartup=false
```

### 5.3 Backend Core NestJS — ECS Fargate

#### 5.3.1 Crear repositorio ECR

```bash
aws ecr create-repository \
  --repository-name vitalbite/core \
  --region us-east-1

# Login Docker → ECR
aws ecr get-login-password --region us-east-1 | \
  docker login --username AWS --password-stdin \
  <ACCOUNT_ID>.dkr.ecr.us-east-1.amazonaws.com
```

#### 5.3.2 Dockerfile de producción

```dockerfile
# Crear en vitalBite-backend-core/Dockerfile.prod
FROM node:20-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY . .
RUN npm run build

FROM node:20-alpine
WORKDIR /app
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/prisma ./prisma
COPY --from=builder /app/src/generated ./src/generated
EXPOSE 3000
CMD ["node", "dist/main"]
```

```bash
# Build y push
docker build -f Dockerfile.prod -t vitalbite-core:latest .
docker tag vitalbite-core:latest \
  <ACCOUNT_ID>.dkr.ecr.us-east-1.amazonaws.com/vitalbite/core:latest
docker push <ACCOUNT_ID>.dkr.ecr.us-east-1.amazonaws.com/vitalbite/core:latest
```

#### 5.3.3 Task Definition ECS

Crear `ecs-task-definition.json`:

```json
{
  "family": "vitalbite-core",
  "networkMode": "awsvpc",
  "requiresCompatibilities": ["FARGATE"],
  "cpu": "512",
  "memory": "1024",
  "executionRoleArn": "arn:aws:iam::<ACCOUNT_ID>:role/ecsTaskExecutionRole",
  "containerDefinitions": [
    {
      "name": "vitalbite-core",
      "image": "<ACCOUNT_ID>.dkr.ecr.us-east-1.amazonaws.com/vitalbite/core:latest",
      "portMappings": [{"containerPort": 3000, "protocol": "tcp"}],
      "environment": [],
      "secrets": [
        {"name": "DATABASE_URL", "valueFrom": "arn:aws:secretsmanager:us-east-1:<ACCOUNT_ID>:secret:vitalbite/core/DATABASE_URL"},
        {"name": "JWT_SECRET", "valueFrom": "arn:aws:secretsmanager:us-east-1:<ACCOUNT_ID>:secret:vitalbite/core/JWT_SECRET"}
      ],
      "logConfiguration": {
        "logDriver": "awslogs",
        "options": {
          "awslogs-group": "/ecs/vitalbite-core",
          "awslogs-region": "us-east-1",
          "awslogs-stream-prefix": "ecs"
        }
      }
    }
  ]
}
```

```bash
# Registrar task definition
aws ecs register-task-definition \
  --cli-input-json file://ecs-task-definition.json \
  --region us-east-1

# Crear cluster
aws ecs create-cluster --cluster-name vitalbite-prod --region us-east-1

# Crear servicio
aws ecs create-service \
  --cluster vitalbite-prod \
  --service-name core-service \
  --task-definition vitalbite-core:1 \
  --desired-count 2 \
  --launch-type FARGATE \
  --network-configuration "awsvpcConfiguration={subnets=[subnet-xxx,subnet-yyy],securityGroups=[sg-xxx],assignPublicIp=ENABLED}" \
  --load-balancers "targetGroupArn=arn:aws:elasticloadbalancing:...,containerName=vitalbite-core,containerPort=3000" \
  --region us-east-1
```

#### 5.3.4 Application Load Balancer + ACM

```bash
# Certificado TLS para api.vitalbite.com
aws acm request-certificate \
  --domain-name api.vitalbite.com \
  --validation-method DNS \
  --region us-east-1

# Crear ALB → Listener HTTPS 443 → Target Group → ECS Service
# (configurar desde consola AWS o con CloudFormation)
```

#### 5.3.5 Secrets Manager

```bash
# Guardar secrets del Core
aws secretsmanager create-secret \
  --name vitalbite/core/DATABASE_URL \
  --secret-string "postgresql://USER:PASS@HOST:6543/DB?schema=public&pgbouncer=true" \
  --region us-east-1

aws secretsmanager create-secret \
  --name vitalbite/core/JWT_SECRET \
  --secret-string "$(openssl rand -hex 64)" \
  --region us-east-1
```

### 5.4 Frontend Angular — S3 + CloudFront

#### 5.4.1 Build de producción

```bash
# Desde vitalBite-frontend-web/
# Actualizar environment.prod.ts con la URL del Core
# environment.prod.ts: graphqlUri: 'https://api.vitalbite.com/graphql'

npm run build
# Genera dist/vitalBite-frontend-web/browser/
```

#### 5.4.2 Bucket S3 para hosting estático

```bash
# Crear bucket
aws s3api create-bucket \
  --bucket vitalbite-app \
  --region us-east-1

# Habilitar hosting estático
aws s3 website s3://vitalbite-app/ \
  --index-document index.html \
  --error-document index.html

# Subir build
aws s3 sync dist/vitalBite-frontend-web/browser/ s3://vitalbite-app/ \
  --cache-control "max-age=31536000,immutable" \
  --exclude "index.html"

aws s3 cp dist/vitalBite-frontend-web/browser/index.html s3://vitalbite-app/ \
  --cache-control "no-cache,no-store,must-revalidate"
```

#### 5.4.3 Distribución CloudFront

```bash
# Crear distribución (simplificado — usar consola o CloudFormation para producción)
aws cloudfront create-distribution --distribution-config '{
  "Origins": {
    "Items": [{
      "Id": "S3-vitalbite-app",
      "DomainName": "vitalbite-app.s3-website-us-east-1.amazonaws.com",
      "S3OriginConfig": {"OriginAccessIdentity": ""}
    }]
  },
  "DefaultCacheBehavior": {
    "ViewerProtocolPolicy": "redirect-to-https",
    "CachePolicyId": "658327ea-f89d-4fab-a63d-7e88639e58f6",
    "Compress": true,
    "ForwardedValues": {"QueryString": false, "Cookies": {"Forward": "none"}}
  },
  "CustomErrorResponses": {
    "Items": [{"ErrorCode": 404, "ResponseCode": 200, "ResponsePagePath": "/index.html"}]
  },
  "Enabled": true,
  "Aliases": {"Items": ["app.vitalbite.com"], "Quantity": 1},
  "ViewerCertificate": {
    "ACMCertificateArn": "arn:aws:acm:us-east-1:<ACCOUNT_ID>:certificate/xxx",
    "SSLSupportMethod": "sni-only",
    "MinimumProtocolVersion": "TLSv1.2_2021"
  }
}'
```

---

## 6. Fase 3 — Backend IA en Google Cloud

Servicio FastAPI para OCR, Deep Learning (MobileNetV2), Random Forest y K-means.

### 6.1 Preparar proyecto GCP

```bash
# Autenticar y configurar proyecto
gcloud auth login
gcloud projects create vitalbite-ia --name="VitalBite IA"
gcloud config set project vitalbite-ia
gcloud services enable run.googleapis.com containerregistry.googleapis.com
```

### 6.2 Dockerfile para FastAPI

```dockerfile
# Crear en vitalBite-backend-ia/Dockerfile
FROM python:3.11-slim

WORKDIR /app

# Dependencias del sistema para OpenCV y EasyOCR
RUN apt-get update && apt-get install -y \
    libglib2.0-0 libsm6 libxext6 libxrender-dev libgomp1 \
    && rm -rf /var/lib/apt/lists/*

COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

COPY . .

# Copiar artefactos ML pre-entrenados
COPY artifacts/ ./artifacts/

EXPOSE 8001
CMD ["python", "-m", "uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8001"]
```

### 6.3 Build y push a Google Container Registry

```bash
# Desde vitalBite-backend-ia/
# Entrenar y serializar modelos antes del build
python -m app.models.training.train_random_forest

# Build para linux/amd64
docker buildx build --platform linux/amd64 \
  -t gcr.io/vitalbite-ia/backend-ia:latest . --push

# O usar Cloud Build directamente
gcloud builds submit --tag gcr.io/vitalbite-ia/backend-ia:latest
```

### 6.4 Desplegar en Cloud Run

```bash
gcloud run deploy vitalbite-ia \
  --image gcr.io/vitalbite-ia/backend-ia:latest \
  --platform managed \
  --region us-central1 \
  --port 8001 \
  --memory 2Gi \
  --cpu 2 \
  --min-instances 1 \
  --max-instances 5 \
  --allow-unauthenticated \
  --set-env-vars="ENVIRONMENT=production,ALLOWED_ORIGINS=https://api.vitalbite.com" \
  --set-secrets="SECRET_KEY=vitalbite-ia-secret:latest"
```

### 6.5 Configurar dominio personalizado

```bash
# Mapear dominio ia.vitalbite.com
gcloud run domain-mappings create \
  --service vitalbite-ia \
  --domain ia.vitalbite.com \
  --region us-central1
```

### 6.6 Secretos en Google Secret Manager

```bash
# Crear secretos
echo -n "valor-secreto" | gcloud secrets create vitalbite-ia-secret --data-file=-
```

---

## 7. Fase 4 — Backend Pagos .NET en Azure

Microservicio .NET 10 minimal API para planes, suscripciones y pagos (con DynamoDB en AWS).

### 7.1 Preparar Azure

```bash
az login
az group create --name vitalbite-rg --location eastus

# Crear Azure Container Registry
az acr create \
  --resource-group vitalbite-rg \
  --name vitalbiteacr \
  --sku Basic

az acr login --name vitalbiteacr
```

### 7.2 Dockerfile para .NET

```dockerfile
# Crear en vitalBite-backend-payments-dotnet/Dockerfile
FROM mcr.microsoft.com/dotnet/aspnet:10.0 AS base
WORKDIR /app
EXPOSE 5100

FROM mcr.microsoft.com/dotnet/sdk:10.0 AS build
WORKDIR /src
COPY ["src/VitalBite.Payments.Api/VitalBite.Payments.Api.csproj", "src/VitalBite.Payments.Api/"]
RUN dotnet restore "src/VitalBite.Payments.Api/VitalBite.Payments.Api.csproj"
COPY . .
RUN dotnet build "src/VitalBite.Payments.Api/VitalBite.Payments.Api.csproj" -c Release -o /app/build

FROM build AS publish
RUN dotnet publish "src/VitalBite.Payments.Api/VitalBite.Payments.Api.csproj" -c Release -o /app/publish

FROM base AS final
WORKDIR /app
COPY --from=publish /app/publish .
ENTRYPOINT ["dotnet", "VitalBite.Payments.Api.dll"]
```

### 7.3 Build y push a ACR

```bash
# Desde vitalBite-backend-payments-dotnet/
docker buildx build --platform linux/amd64 \
  -t vitalbiteacr.azurecr.io/payments:latest . --push
```

### 7.4 Desplegar en Azure Container Apps

```bash
# Crear entorno de Container Apps
az containerapp env create \
  --name vitalbite-env \
  --resource-group vitalbite-rg \
  --location eastus

# Crear Container App
az containerapp create \
  --name vitalbite-payments \
  --resource-group vitalbite-rg \
  --environment vitalbite-env \
  --image vitalbiteacr.azurecr.io/payments:latest \
  --registry-server vitalbiteacr.azurecr.io \
  --target-port 5100 \
  --ingress external \
  --min-replicas 1 \
  --max-replicas 3 \
  --env-vars \
    ASPNETCORE_URLS=http://+:5100 \
    DynamoDB__Region=us-east-1 \
    DynamoDB__TableName=VitalBitePayments \
    DynamoDB__SeedOnStartup=false \
  --secrets \
    aws-access-key=<AWS_ACCESS_KEY_ID> \
    aws-secret-key=<AWS_SECRET_ACCESS_KEY>
```

### 7.5 Configurar dominio personalizado

```bash
# Asignar dominio pagos.vitalbite.com
az containerapp hostname add \
  --name vitalbite-payments \
  --resource-group vitalbite-rg \
  --hostname pagos.vitalbite.com

# TLS gestionado por Azure
az containerapp ssl upload \
  --name vitalbite-payments \
  --resource-group vitalbite-rg \
  --hostname pagos.vitalbite.com \
  --certificate-file cert.pfx \
  --certificate-password ""
```

---

## 8. Fase 5 — Backend Gestión Documental en DigitalOcean

Microservicio Spring Boot 4 / Java 21 para PDFs, reportes, gestión documental y almacenamiento S3.

### 8.1 Preparar DigitalOcean

```bash
# Autenticar doctl
doctl auth init

# Crear registro de contenedores
doctl registry create vitalbite-registry

# Login Docker → DO Registry
doctl registry login
```

### 8.2 Dockerfile para Spring Boot

```dockerfile
# Crear en vitalBite-Spring-Boot/Dockerfile
FROM eclipse-temurin:21-jdk-alpine AS builder
WORKDIR /app
COPY mvnw .
COPY .mvn .mvn
COPY pom.xml .
RUN ./mvnw dependency:go-offline -q
COPY src src
RUN ./mvnw clean package -DskipTests

FROM eclipse-temurin:21-jre-alpine
WORKDIR /app
COPY --from=builder /app/target/*.jar app.jar
EXPOSE 8082
ENTRYPOINT ["java", "-jar", "app.jar"]
```

### 8.3 Build y push al DO Registry

```bash
# Desde vitalBite-Spring-Boot/
docker buildx build --platform linux/amd64 \
  -t registry.digitalocean.com/vitalbite-registry/documental:latest . --push
```

### 8.4 Desplegar en App Platform

Crear archivo `.do/app.yaml`:

```yaml
name: vitalbite-documental
region: nyc

services:
  - name: documental-api
    image:
      registry_type: DOCR
      registry: vitalbite-registry
      repository: documental
      tag: latest
    instance_count: 1
    instance_size_slug: professional-xs
    http_port: 8082
    routes:
      - path: /
    health_check:
      http_path: /api/v1/health
      initial_delay_seconds: 30
      period_seconds: 30
    envs:
      - key: SERVER_PORT
        value: "8082"
      - key: SPRING_PROFILES_ACTIVE
        value: "production"
      - key: DB_URL
        scope: RUN_TIME
        type: SECRET
      - key: DB_USERNAME
        scope: RUN_TIME
        type: SECRET
      - key: DB_PASSWORD
        scope: RUN_TIME
        type: SECRET
      - key: AWS_ACCESS_KEY_ID
        scope: RUN_TIME
        type: SECRET
      - key: AWS_SECRET_ACCESS_KEY
        scope: RUN_TIME
        type: SECRET
      - key: AWS_S3_BUCKET
        value: "vitalbite-docs"
      - key: AWS_S3_REGION
        value: "us-east-1"
      - key: JWT_SECRET
        scope: RUN_TIME
        type: SECRET
```

```bash
# Desplegar vía CLI
doctl apps create --spec .do/app.yaml

# O desde la consola web de DigitalOcean:
# Apps → Create App → From Container Registry
```

### 8.5 Variables secretas en DigitalOcean

```bash
# Agregar secretos al app existente
doctl apps update <APP_ID> --spec .do/app.yaml
# Los campos type: SECRET se configuran desde la consola web
```

---

## 9. Variables de entorno por servicio

### 9.1 Backend Core (NestJS) — AWS Secrets Manager

| Variable | Descripción |
|---|---|
| `DATABASE_URL` | Connection string Supabase (pgbouncer) |
| `JWT_SECRET` | Clave secreta JWT (mínimo 64 caracteres hex) |
| `JWT_EXPIRES_IN` | Expiración token (ej. `8h`) |
| `PAYMENTS_SERVICE_URL` | `https://pagos.vitalbite.com` |
| `IA_SERVICE_URL` | `https://ia.vitalbite.com` |
| `DOCUMENTAL_SERVICE_URL` | `https://docs.vitalbite.com` |
| `GRAPHQL_PLAYGROUND` | `false` en producción |
| `PORT` | `3000` |

### 9.2 Backend IA (FastAPI) — Google Secret Manager

| Variable | Descripción |
|---|---|
| `ENVIRONMENT` | `production` |
| `SECRET_KEY` | Clave para endpoints internos |
| `ALLOWED_ORIGINS` | `https://api.vitalbite.com` |
| `MODEL_PATH` | Ruta a `artifacts/` |

### 9.3 Backend Pagos (.NET) — Azure Container Apps secrets

| Variable | Descripción |
|---|---|
| `ASPNETCORE_URLS` | `http://+:5100` |
| `DynamoDB__ServiceURL` | `https://dynamodb.us-east-1.amazonaws.com` |
| `DynamoDB__Region` | `us-east-1` |
| `DynamoDB__TableName` | `VitalBitePayments` |
| `AWS_ACCESS_KEY_ID` | IAM key con acceso a DynamoDB |
| `AWS_SECRET_ACCESS_KEY` | IAM secret correspondiente |
| `DynamoDB__SeedOnStartup` | `false` |

### 9.4 Backend Documental (Spring Boot) — DigitalOcean App secrets

| Variable | Descripción |
|---|---|
| `DB_URL` | JDBC URL PostgreSQL Supabase |
| `DB_USERNAME` | Usuario DB |
| `DB_PASSWORD` | Contraseña DB |
| `AWS_ACCESS_KEY_ID` | IAM key con acceso a S3 |
| `AWS_SECRET_ACCESS_KEY` | IAM secret correspondiente |
| `AWS_S3_BUCKET` | `vitalbite-docs` |
| `AWS_S3_REGION` | `us-east-1` |
| `JWT_SECRET` | Debe ser igual al del Core para validar tokens |
| `CORE_SERVICE_URL` | `https://api.vitalbite.com` |

### 9.5 Frontend Angular — `environment.prod.ts`

```typescript
export const environment = {
  production: true,
  graphqlUri: 'https://api.vitalbite.com/graphql',
};
```

---

## 10. Comunicación entre microservicios

Todos los microservicios internos son llamados por el Core NestJS vía HTTP/REST. Los clientes (Angular y React Native) se comunican **únicamente** con el Core vía GraphQL.

```
Angular / React Native
        │
        │  GraphQL over HTTPS
        ▼
api.vitalbite.com (Core NestJS — AWS ECS Fargate)
        │
        ├──► ia.vitalbite.com       (FastAPI — Google Cloud Run)     REST/HTTPS
        ├──► pagos.vitalbite.com    (.NET — Azure Container Apps)    REST/HTTPS
        └──► docs.vitalbite.com     (Spring Boot — DigitalOcean)     REST/HTTPS
```

### Configuración CORS en cada microservicio

Cada servicio debe aceptar únicamente peticiones provenientes del Core:

| Servicio | `ALLOWED_ORIGINS` |
|---|---|
| FastAPI | `https://api.vitalbite.com` |
| .NET | `https://api.vitalbite.com` |
| Spring Boot | `https://api.vitalbite.com` |

---

## 11. Seguridad y networking

### 11.1 IAM AWS — Principio de mínimo privilegio

Crear un rol IAM independiente para cada servicio que acceda a AWS:

| Servicio | Permisos necesarios |
|---|---|
| Core NestJS (ECS Task Role) | `dynamodb:Query`, `dynamodb:PutItem`, `dynamodb:GetItem`, `s3:GetObject` |
| Spring Boot (DO) | `s3:GetObject`, `s3:PutObject`, `s3:DeleteObject` |
| .NET (Azure) | `dynamodb:*` en tabla `VitalBitePayments` únicamente |

### 11.2 Autenticación entre servicios

El Core valida su identidad ante los microservicios usando un header `X-Internal-Api-Key` secreto compartido (almacenado en Secrets Manager / Secret Manager / Key Vault según la nube).

Spring Boot además valida el JWT del usuario original para operaciones que requieren contexto del paciente.

### 11.3 Security Groups AWS (Core ECS)

| Tipo | Puerto | Origen |
|---|---|---|
| Inbound | 3000 | ALB Security Group |
| Outbound | 443 | 0.0.0.0/0 (llamadas a microservicios externos) |
| Outbound | 5432/6543 | Supabase IP ranges |

### 11.4 HTTPS obligatorio

Todos los servicios exponen únicamente HTTPS en producción:
- AWS ALB redirige HTTP → HTTPS.
- CloudFront fuerza HTTPS (`redirect-to-https`).
- Cloud Run (GCP) sirve HTTPS por defecto.
- Azure Container Apps usa TLS gestionado.
- DigitalOcean App Platform provee certificados Let's Encrypt automáticamente.

---

## 12. Orden de despliegue recomendado

Seguir este orden para evitar dependencias rotas en el arranque:

```
[1] Supabase PostgreSQL
      ↓  migraciones + seed
[2] AWS S3 (bucket vitalbite-docs)
      ↓
[3] AWS DynamoDB (tabla VitalBitePayments)
      ↓
[4] Backend Pagos .NET → Azure Container Apps
      ↓  URL: pagos.vitalbite.com
[5] Backend IA FastAPI → Google Cloud Run
      ↓  URL: ia.vitalbite.com
[6] Backend Documental Spring Boot → DigitalOcean App Platform
      ↓  URL: docs.vitalbite.com
[7] Backend Core NestJS → AWS ECS Fargate
      ↓  URL: api.vitalbite.com/graphql
[8] Frontend Angular → AWS S3 + CloudFront
           URL: app.vitalbite.com
```

> **Nota:** El Core no puede arrancar correctamente si `DATABASE_URL` apunta a una base de datos sin las migraciones aplicadas. Siempre ejecutar `prisma migrate deploy` antes de escalar el servicio.

---

## 13. Verificación y smoke tests

Una vez desplegados todos los servicios, ejecutar las siguientes verificaciones:

### 13.1 Supabase PostgreSQL

```bash
psql $DATABASE_URL -c "SELECT COUNT(*) FROM \"User\";"
psql $DATABASE_URL -c "SELECT COUNT(*) FROM \"Tenant\";"
```

### 13.2 Backend Core (GraphQL)

```bash
# Health check
curl https://api.vitalbite.com/health

# Introspección GraphQL (solo si GRAPHQL_PLAYGROUND=true temporalmente)
curl -X POST https://api.vitalbite.com/graphql \
  -H "Content-Type: application/json" \
  -d '{"query":"{ __typename }"}'
# Esperado: {"data":{"__typename":"Query"}}

# Login
curl -X POST https://api.vitalbite.com/graphql \
  -H "Content-Type: application/json" \
  -d '{"query":"mutation { login(input:{email:\"admin@demo.com\",password:\"Admin123\"}) { token } }"}'
```

### 13.3 Backend IA (FastAPI)

```bash
curl https://ia.vitalbite.com/health
# Esperado: {"status":"ok","models_loaded":true}
```

### 13.4 Backend Pagos (.NET)

```bash
curl https://pagos.vitalbite.com/health
# Esperado: HTTP 200
curl https://pagos.vitalbite.com/api/planes
# Esperado: lista de planes JSON
```

### 13.5 Backend Documental (Spring Boot)

```bash
curl https://docs.vitalbite.com/api/v1/health
# Esperado: {"status":"UP"}
```

### 13.6 Frontend Angular

Abrir `https://app.vitalbite.com` en el navegador:
- [ ] La página de login carga sin errores de consola.
- [ ] El login con credenciales de admin funciona.
- [ ] El dashboard muestra datos reales (no mock).
- [ ] La generación de un reporte PDF funciona end-to-end.

---

## 14. Rollback

### Estrategia por servicio

| Servicio | Mecanismo de rollback |
|---|---|
| Core NestJS (ECS) | `aws ecs update-service --task-definition vitalbite-core:<VERSION_ANTERIOR>` |
| Frontend Angular (CloudFront) | `aws s3 sync s3://vitalbite-app-backup/ s3://vitalbite-app/` + invalidación CloudFront |
| FastAPI (Cloud Run) | `gcloud run services update-traffic vitalbite-ia --to-revisions=<REVISION>=100` |
| .NET (Container Apps) | `az containerapp revision activate --name <REVISION_ANTERIOR>` |
| Spring Boot (DO App Platform) | Redeployment desde el panel de DigitalOcean seleccionando imagen anterior |
| Supabase (Migraciones) | Ejecutar migración de reversión: `npx prisma migrate resolve --rolled-back <MIGRATION>` |

### Rollback de base de datos

> **Advertencia:** Las migraciones de base de datos son la parte más crítica. Antes de cada despliegue que incluya cambios de esquema:
> 1. Tomar snapshot manual en Supabase (Dashboard → Settings → Backups).
> 2. Probar la migración en entorno de staging antes de producción.
> 3. Solo ejecutar migraciones destructivas (DROP COLUMN, DROP TABLE) después de confirmar que el código nuevo funciona correctamente.

---

## Apéndice — Diagrama DNS

```
vitalbite.com (Route 53 / DNS provider)
  ├── app.vitalbite.com      → CloudFront Distribution (AWS)
  ├── api.vitalbite.com      → ALB (AWS ECS Fargate)
  ├── ia.vitalbite.com       → Cloud Run service (Google Cloud)
  ├── pagos.vitalbite.com    → Container App (Azure)
  └── docs.vitalbite.com     → DigitalOcean App Platform
```

---

*Documento generado para el proyecto académico VitalBite — Software 2.*
