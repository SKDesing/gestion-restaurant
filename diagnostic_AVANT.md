# 📊 Diagnostic Avant Nettoyage

## Métadonnées

- Date : 2025-10-21
- Branche actuelle : backup-avant-nettoyage-20251021_233932
- Dernier commit : $(git log -1 --oneline)

## 1. Taille Repository

```
du -sh .git
du -sh . --exclude=.git
```

## 2. Fichiers Trackés

Total : $(git ls-files | wc -l)

### Fichiers .next/ trackés

```
git ls-files | grep "^\.next/"
```

### Fichiers out/ trackés

```
git ls-files | grep "^out/"
```

### Fichiers build/ trackés

```
git ls-files | grep "^build/"
```

### Fichiers node_modules/ trackés

```
git ls-files | grep "^node_modules/"
```

## 3. Top 20 Fichiers les Plus Lourds

```
git ls-files | xargs du -h 2>/dev/null | sort -rh | head -20
```

## 4. Fichiers HTML

```
git ls-files | grep "\.html$"
```

## 5. Contenu .gitignore Actuel

```
cat .gitignore
```

## 6. Structure Projet

```
tree -L 3 -I 'node_modules|.next|.git'
```

## 7. Erreurs TypeScript Actuelles

```
pnpm tsc --noEmit 2>&1 | head -50
```

## 8. Branches Existantes

```
git branch -a
```
