Development notes

Run database + app locally with Docker Compose:

```bash
docker compose up --build
```

The Next custom server is served at http://localhost:4000. NEXTAUTH_URL is set for local dev in the compose environment.

To seed the database (after the DB is ready):

```bash
pnpm exec tsx prisma/seed.ts
```

CI: there's a GitHub Actions workflow at `.github/workflows/ci.yml` which runs `pnpm install`, `prisma generate` and `pnpm run build`.
