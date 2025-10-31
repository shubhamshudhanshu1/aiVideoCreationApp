# Tip: Use the 'development' stage for local dev with Compose: 
# docker-compose up app-dev

# ---- Base Node ----
FROM node:18-alpine AS base

RUN apk add --no-cache dumb-init ca-certificates

WORKDIR /app

# Install dependencies based on the preferred package manager
COPY package.json yarn.lock package-lock.json ./

# Install dependencies (handle both Yarn and npm users)
# Prefer npm if package-lock.json exists; fallback to yarn only if no npm lockfile
RUN if [ -f package-lock.json ]; then \
      npm install; \
    elif [ -f yarn.lock ]; then \
      corepack enable && yarn install --frozen-lockfile; \
    else \
      npm install; \
    fi

# Copy only schema for Prisma generate
COPY prisma ./prisma
# Do not run prisma generate at build time to avoid CA/proxy issues

# Copy the code
COPY . ./

# ---- Development ----
FROM base AS development
ENV NODE_ENV=development
EXPOSE 3000
RUN addgroup -g 1001 -S appgroup && adduser -S appuser -G appgroup -u 1001
# Generate Prisma client as root, then fix ownership for non-root runtime
RUN NODE_TLS_REJECT_UNAUTHORIZED=0 PRISMA_ENGINES_CHECKSUM_IGNORE=1 npx prisma generate
RUN chown -R appuser:appgroup /app
USER appuser
ENTRYPOINT ["dumb-init", "--"]
CMD [ "npx", "next", "dev" ]

# ---- Build ----
FROM base AS builder
ENV NODE_ENV=production
# Generate Prisma client during build
RUN NODE_TLS_REJECT_UNAUTHORIZED=0 PRISMA_ENGINES_CHECKSUM_IGNORE=1 npx prisma generate
RUN if [ -f package-lock.json ]; then npm run build; else yarn build; fi

# ---- Production ----
FROM node:18-alpine AS runner
LABEL org.opencontainers.image.title="ai-video-creation-app"
LABEL org.opencontainers.image.authors="YOU <your@email.com>"

WORKDIR /app

RUN apk add --no-cache dumb-init ca-certificates wget

# Create non-root user
RUN addgroup -g 1001 -S appgroup && adduser -S appuser -G appgroup -u 1001

# Copy dependencies and built files from builder
COPY --from=builder /app/public ./public
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package.json ./package.json
COPY --from=builder /app/prisma ./prisma
COPY --from=builder /app/src ./src
# Ensure the non-root user owns the app directory (needed for Prisma engines write at runtime)
RUN chown -R appuser:appgroup /app

# For Prisma/Production migration (optional, for non-SQLite)
# COPY --from=builder /app/prisma ./prisma

# Set environment variables
ENV NODE_ENV=production
ENV PORT=3000

EXPOSE 3000

HEALTHCHECK --interval=30s --timeout=10s --start-period=30s \
  CMD wget --no-verbose --tries=1 --spider http://localhost:3000 || exit 1

USER appuser

ENTRYPOINT ["dumb-init", "--"]
CMD [ "node", "./node_modules/.bin/next", "start" ]
