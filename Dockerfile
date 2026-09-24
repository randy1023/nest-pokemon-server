# ============================
# Etapa 1: Dependencias
# ============================
FROM node:22-alpine AS deps

# libc6-compat es necesaria para algunas dependencias nativas en Alpine
RUN apk add --no-cache libc6-compat

# Activar pnpm vía corepack (Node 22 lo trae de serie)
RUN corepack enable && corepack prepare pnpm@latest --activate

WORKDIR /app

# Copiar manifiestos y configuración de TypeScript
COPY package.json pnpm-lock.yaml tsconfig.json tsconfig.build.json ./

# Instalar TODAS las dependencias (incluye dev, necesarias para build)
RUN pnpm install --frozen-lockfile

# ============================
# Etapa 2: Build
# ============================
FROM node:22-alpine AS builder

RUN corepack enable && corepack prepare pnpm@latest --activate

WORKDIR /app

# Reutilizar node_modules de la etapa anterior
COPY --from=deps /app/node_modules ./node_modules

# Copiar el resto del código
COPY . .

# Compilar NestJS
RUN pnpm build

# ============================
# Etapa 3: Runtime (imagen final)
# ============================
FROM node:22-alpine AS runner

RUN apk add --no-cache libc6-compat

RUN corepack enable && corepack prepare pnpm@latest --activate

WORKDIR /usr/src/app

# Copiar manifiestos
COPY package.json pnpm-lock.yaml ./

# Instalar SOLO dependencias de producción
RUN pnpm install --prod --frozen-lockfile

# Copiar el build compilado desde la etapa anterior
COPY --from=builder /app/dist ./dist

# # Copiar el directorio y su contenido
# RUN mkdir -p ./pokedex

# COPY --from=builder ./app/dist/ ./app
# COPY ./.env ./app/.env

# # Dar permiso para ejecutar la applicación
# RUN adduser --disabled-password pokeuser
# RUN chown -R pokeuser:pokeuser ./pokedex
# USER pokeuser

# EXPOSE 3000

CMD ["node", "dist/main"]