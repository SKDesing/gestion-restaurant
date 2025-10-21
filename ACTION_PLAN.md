# ⚡ Plan d'Action Recommandé

## Phase 1 : Nettoyage Git (NON-DESTRUCTIF)

- [ ] Retirer .next/ du tracking (`git rm -r --cached .next`)
- [ ] Retirer out/ du tracking
- [ ] Retirer build/ du tracking
- [ ] Mettre à jour .gitignore

## Phase 2 : Correction TypeScript

- [ ] Installer @types/node
- [ ] Corriger tsconfig.json
- [ ] Créer next-env.d.ts

## Phase 3 : Migration HTML → React

- [ ] [Liste à compléter après analyse]

## Phase 4 : Validation

- [ ] `pnpm run build` réussi
- [ ] `pnpm run lint` réussi
- [ ] Tests passants

## Phase 5 : Nettoyage Historique (DESTRUCTIF - OPTIONNEL)

- [ ] ⚠️ **ATTENTION** : Requiert coordination équipe
- [ ] Backup complet réalisé
- [ ] `git filter-repo` exécuté
- [ ] Force push coordonné

## Estimation Temps

- Phase 1-2 : 30 min
- Phase 3 : 2-4h (selon nombre de fichiers HTML)
- Phase 4 : 30 min
- Phase 5 : 1h + coordination équipe
