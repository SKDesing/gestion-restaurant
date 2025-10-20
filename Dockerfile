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
