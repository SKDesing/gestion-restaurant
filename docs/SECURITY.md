# SECURITY

Security guidelines for `gestion-restaurant`.

- Use strong NEXTAUTH_SECRET and rotate periodically.
- Store secrets in GitHub Actions secrets or a secrets manager.
- Use HTTPS in production and HSTS.
- Run dependency audits weekly (see `.github/workflows/security.yml`).
