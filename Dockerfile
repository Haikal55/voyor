# Multi-stage Dockerfile for VOYOR E-Commerce
# 100% Free, Standalone, Self-Hostable on any VPS, Docker, Coolify, or Cloud

FROM node:20-alpine AS base
WORKDIR /app
RUN apk add --no-cache libc6-compat python3 make g++

# Dependencies Stage
FROM base AS deps
COPY package.json package-lock.json ./
RUN npm ci

# Builder Stage
FROM base AS builder
COPY --from=deps /app/node_modules ./node_modules
COPY . .
ENV NEXT_TELEMETRY_DISABLED=1
RUN npx tsx src/lib/db/seed.ts
RUN npm run build

# Runner Stage
FROM base AS runner
WORKDIR /app
ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1
ENV PORT=3000
ENV HOSTNAME="0.0.0.0"

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

COPY --from=builder /app/public ./public
COPY --from=builder /app/voyor.db ./voyor.db

# Set up standalone server
RUN mkdir .next
RUN chown nextjs:nodejs .next voyor.db

COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

USER nextjs

EXPOSE 3000

CMD ["node", "server.js"]
