# DEPLOYMENT

This document describes how to deploy the `gestion-restaurant` application using Docker and GitHub Actions.

Prerequisites:

- Docker and docker-compose
- An environment with PostgreSQL (or the included docker-compose service)
- Secrets set in GitHub (DATABASE*URL, NEXTAUTH_SECRET, MAILCOW*\*, etc.)

Quickstart (local):

1. Copy `.env.example` to `.env` and fill values.
2. Start services:

```bash
docker compose up -d --build
```

3. Seed the database (if needed):

```bash
docker compose exec app pnpm run prisma:seed
```
