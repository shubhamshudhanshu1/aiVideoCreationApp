# ---- Base Node ----
FROM node:18-alpine AS base

RUN apk add --no-cache dumb-init

WORKDIR /app

# Install dependencies based on the preferred package manager
COPY package.json yarn.lock package-lock.json ./

# Install dependencies (handle both Yarn and npm users)
RUN if [ -f yarn.lock ]; then yarn install --frozen-lockfile --production=false; else npm install --omit=dev; fi

# Copy only schema for Prisma generate
COPY prisma ./prisma
RUN if [ -f yarn.lock ]; then yarn run prisma generate; else npx prisma generate; fi

# Copy the code
COPY . ./

# ---- Build ----
FROM base AS builder
ENV NODE_ENV=production
RUN if [ -f yarn.lock ]; then yarn build; else npm run build; fi

# ---- Production ----
FROM node:18-alpine AS runner
LABEL org.opencontainers.image.title="ai-video-creation-app"
LABEL org.opencontainers.image.authors="YOU <your@email.com>"

WORKDIR /app

RUN apk add --no-cache dumb-init

# Create non-root user
RUN addgroup -g 1001 -S appgroup && adduser -S appuser -G appgroup -u 1001

# Copy dependencies and built files from builder
COPY --from=builder /app/public ./public
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package.json ./package.json
COPY --from=builder /app/prisma ./prisma
COPY --from=builder /app/src ./src
COPY --from=builder /app/EMAIL_OTP_SETUP.md ./EMAIL_OTP_SETUP.md

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
