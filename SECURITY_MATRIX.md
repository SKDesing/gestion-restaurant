-# Matrice de Sécurité

## Résumé audit (package manager: pnpm)

- Fichiers générés: `audit_reports/pnpm_audit_full.json`, `audit_reports/pnpm_audit_prod.json`, `audit_reports/pnpm_audit_readable.txt`
- Résumé: 3 vulnerabilities de gravité modérée détectées liées à `prismjs` via `refractor` / `react-syntax-highlighter`. `pnpm audit` (ou `pnpm audit --json`) n'a pas résolu ces vulnérabilités automatiquement; la correction exige une mise à jour majeure (`react-syntax-highlighter@15.6.6`) ou un audit forcé manuel en branche isolée.

## Vulnérabilités critiques / hautes

Aucune vulnérabilité critique ou haute détectée dans le rapport actuel.

## Vulnérabilités modérées

- prismjs (DOM Clobbering) via `refractor` -> `react-syntax-highlighter` (3 occurrences)

## Recommandations

1. Option conservative (déjà partiellement appliquée): Mettre à jour la dépendance directe (`react-syntax-highlighter`) vers une version qui résout la vulnérabilité (ex: `^15.6.6`). Cette opération peut être majeure et impliquer des breaking changes; tester entièrement.

2. Option force (automatique, risquée): Exécuter des mises à jour ciblées dans une branche isolée (`audit/force-fix`) et exécuter la batterie complète de tests (build, TS, ESLint, runtime, E2E) ; documenter et corriger les régressions avant merge. Note: pnpm ne propose pas d'équivalent exact à `npm audit fix --force`; privilégier les mises à jour manuelles et tests approfondis.

3. Option alternative: Remplacer l'utilisation de `react-syntax-highlighter` par une alternative maintenue (ex: `prism-react-renderer`) si l'upgrade majeure n'est pas faisable rapidement.

## Plan d'action recommandé

- Créer une branche isolée `audit/force-fix` et appliquer manuellement `pnpm add react-syntax-highlighter@15.6.6 --save-exact` (ou modifier le lockfile), puis exécuter la suite complète de validations décrites dans le plan (build, runtime tests, auth smoke test, Docker build). Documenter toutes les régressions et les corrections.

## Notes

- Un `npm audit fix --force` peut mettre à jour plusieurs paquets en breaking changes; ne pas appliquer directement sur `main`.
