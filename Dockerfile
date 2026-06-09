# --- Etapa 1: Construcción (Build) ---
FROM node:20-alpine AS builder

# Instalar herramientas necesarias para Prisma en Alpine
RUN apk add --no-cache openssl

# Habilitar corepack para usar pnpm
RUN corepack enable && corepack prepare pnpm@10.30.0 --activate

# Establecer directorio de trabajo
WORKDIR /app

# Copiar archivos de dependencias
COPY package.json pnpm-lock.yaml ./
COPY prisma ./prisma/

# Instalar todas las dependencias
RUN pnpm install --frozen-lockfile

# Generar el cliente de Prisma
RUN pnpm prisma:generate

# Copiar el resto del código fuente
COPY . .

# Compilar la aplicación NestJS
RUN pnpm build

# --- Etapa 2: Producción (Production) ---
FROM node:20-alpine AS production

# Instalar OpenSSL para Prisma
RUN apk add --no-cache openssl

# Habilitar corepack para usar pnpm
RUN corepack enable && corepack prepare pnpm@10.30.0 --activate

# Establecer directorio de trabajo
WORKDIR /app

# Configurar entorno de producción
ENV NODE_ENV=production

# Copiar archivos esenciales desde la etapa de construcción
COPY --from=builder /app/package.json ./
COPY --from=builder /app/pnpm-lock.yaml ./
COPY --from=builder /app/prisma ./prisma
COPY --from=builder /app/dist ./dist

# Instalar solo las dependencias de producción
RUN pnpm install --prod --frozen-lockfile

# Generar el cliente de Prisma (necesario en producción también)
RUN pnpm prisma:generate

# Exponer el puerto de la aplicación (asumiendo 3000 por defecto)
EXPOSE 3000

# Comando para iniciar la aplicación
CMD ["node", "dist/src/main.js"]
