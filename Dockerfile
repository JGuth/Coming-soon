# Multi-stage production build for PipeBand.app
# Stage 1: Build client and server bundles
FROM node:22-alpine AS builder

WORKDIR /app

# Install dependencies first for Docker layer caching
COPY package.json ./
RUN npm install --frozen-lockfile || npm install

# Copy source code and build assets
COPY . .
RUN npm run build

# Stage 2: Minimal, secure production runtime
FROM node:22-alpine AS runner

WORKDIR /app

ENV NODE_ENV=production
ENV PORT=3000
ENV DB_PATH=/app/data/pipeband_signups.db

# Create non-root application user and persistent data volume
RUN addgroup -g 1001 -S appgroup && \
    adduser -u 1001 -S appuser -G appgroup && \
    mkdir -p /app/data && \
    chown -R appuser:appgroup /app

# Copy production package specifications
COPY package.json ./
RUN npm install --omit=dev --ignore-scripts

# Copy compiled assets from builder stage
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/public ./public

# Ensure app directory permissions
RUN chown -R appuser:appgroup /app

USER appuser

EXPOSE 3000

# Docker healthcheck querying the /api/health endpoint
HEALTHCHECK --interval=30s --timeout=5s --start-period=5s --retries=3 \
  CMD wget -qO- http://localhost:3000/api/health || exit 1

# Start the bundled Express production server
CMD ["node", "dist/server.js"]
