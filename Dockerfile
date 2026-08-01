# Hotels Vendors — Next.js App (standalone)
FROM node:20-alpine AS builder

WORKDIR /app

# Install dependencies (frozen lockfile for reproducibility)
COPY package.json package-lock.json* ./
RUN npm ci --legacy-peer-deps

# Copy source code
COPY . .

# Generate Prisma client
RUN npx prisma generate

# Build Next.js (produces .next/standalone for production)
ENV NEXT_TELEMETRY_DISABLED=1
RUN npm run build

# ─── Runtime stage (minimal, production-only) ───
FROM node:20-alpine AS runner

WORKDIR /app
ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1

# Copy standalone output from builder
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static
COPY --from=builder /app/public ./public
COPY --from=builder /app/prisma ./prisma
COPY --from=builder /app/package.json ./

EXPOSE 3000
CMD ["node", "server.js"]
