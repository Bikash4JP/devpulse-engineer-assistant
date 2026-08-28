# ===================================================
# STAGE 1: BUILDER STAGE (Compile TypeScript)
# ===================================================
FROM node:20-alpine AS builder

WORKDIR /app

# Copy package manifests and install dependencies
COPY package*.json ./
COPY prisma ./prisma/

RUN npm ci

# Copy source code and compile TypeScript to dist/
COPY tsconfig.json ./
COPY src ./src
RUN npm run build

# ===================================================
# STAGE 2: PRODUCTION STAGE (Slim Production Image)
# ===================================================
FROM node:20-alpine AS production

WORKDIR /app

ENV NODE_ENV=production

# Install curl for container healthchecks
RUN apk add --no-cache curl && apk add --no-cache openssl

# Copy package manifests and install ONLY production packages
COPY package*.json ./
RUN npm ci --only=production

# Copy compiled JavaScript dist from builder stage
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/prisma ./prisma

# Expose server port 5000
EXPOSE 5000

# Automated Docker Healthcheck (Polls health endpoint every 30s)
HEALTHCHECK --interval=30s --timeout=5s --start-period=10s --retries=3 \
  CMD curl -f http://localhost:5000/api/v1/health || exit 1

# Server launch command
CMD ["node", "dist/index.js"]
