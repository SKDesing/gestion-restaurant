FROM node:20-alpine AS base
WORKDIR /app

# Install deps
COPY package*.json pnpm-lock.yaml* ./
RUN apk add --no-cache libc6-compat
RUN npm ci --production

# Copy sources
COPY . .

# Build
RUN npm run build

FROM node:20-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production
COPY --from=base /app/.next ./.next
COPY --from=base /app/public ./public
COPY --from=base /app/node_modules ./node_modules
COPY --from=base /app/package.json ./package.json

EXPOSE 3000
CMD [ "npm", "run", "start" ]
FROM node:20-alpine AS builder
WORKDIR /app
COPY package*.json ./
# Install all dependencies so build (next build) can run (typescript is a devDependency)
RUN npm install
COPY . .
ENV DATABASE_URL="postgresql://postgres:postgres@localhost:5432/gestion"
# Ensure Prisma client is generated for the build
RUN npx prisma generate || true
RUN npm run build
RUN npm prune --production

FROM node:20-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production
COPY --from=builder /app .
EXPOSE 4000
# Run the server using node (tsx may be available but we start with the compiled server entry)
CMD ["npx", "tsx", "server.ts"]
