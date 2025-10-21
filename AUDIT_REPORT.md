]633;E;echo "# AUDIT_REPORT - $(date --iso-8601=seconds)";a3e47730-32ca-4e59-a730-b280dda3e6d9]633;C# AUDIT_REPORT - 2025-10-20T19:15:41+02:00
\n## Vulnerabilities Summary (raw)
\n---\n

# Audit report (originally generated via npm tooling)

highlight.js <=10.4.0
Severity: moderate
ReDOS vulnerabities: multiple grammars - https://github.com/advisories/GHSA-7wwv-vh3v-89cq
Prototype Pollution in highlight.js - https://github.com/advisories/GHSA-vfrc-7r7c-w9mx
fix available via manual upgrade (e.g. `pnpm add react-syntax-highlighter@15.6.6 --save-exact`) which is a breaking change
node_modules/highlight.js
lowlight <=1.16.0
Depends on vulnerable versions of highlight.js
node_modules/lowlight
react-syntax-highlighter <=12.2.1
Depends on vulnerable versions of highlight.js
Depends on vulnerable versions of lowlight
node_modules/react-syntax-highlighter

3 moderate severity vulnerabilities

To address these issues safely with pnpm: create a branch, update the package with pnpm (for example `pnpm add react-syntax-highlighter@15.6.6 --save-exact`), run the full test matrix (build, tsc, eslint, e2e) and document regressions.
\n## Outdated Packages (long)
\n---\n
Package Current Wanted Latest Location Depended by Package Type Homepage
@tailwindcss/postcss 4.1.14 4.1.15 4.1.15 node_modules/@tailwindcss/postcss gestion restaurant dependencies https://tailwindcss.com
@tanstack/react-query 5.90.3 5.90.5 5.90.5 node_modules/@tanstack/react-query gestion restaurant dependencies https://tanstack.com/query
@types/node 20.19.21 20.19.22 24.9.0 node_modules/@types/node gestion restaurant devDependencies https://github.com/DefinitelyTyped/DefinitelyTyped/tree/master/types/node
eslint 9.37.0 9.38.0 9.38.0 node_modules/eslint gestion restaurant devDependencies https://eslint.org
eslint-config-next 15.3.5 15.3.5 15.5.6 node_modules/eslint-config-next gestion restaurant devDependencies https://nextjs.org/docs/app/api-reference/config/eslint
lucide-react 0.525.0 0.525.0 0.546.0 node_modules/lucide-react gestion restaurant dependencies https://lucide.dev
react-syntax-highlighter 5.8.0 5.8.0 15.6.6 node_modules/react-syntax-highlighter gestion restaurant dependencies https://github.com/react-syntax-highlighter/react-syntax-highlighter#readme
recharts 2.15.4 2.15.4 3.3.0 node_modules/recharts gestion restaurant dependencies https://github.com/recharts/recharts
tailwindcss 4.1.14 4.1.15 4.1.15 node_modules/tailwindcss gestion restaurant dependencies https://tailwindcss.com
uuid 11.1.0 11.1.0 13.0.0 node_modules/uuid gestion restaurant dependencies https://github.com/uuidjs/uuid#readme
\n## pnpm ls prismjs
\n---\n
nextjs_tailwind_shadcn_ts@0.1.0 /home/soufiane/Bureau/gestion restaurant
└─┬ @mdxeditor/editor@3.47.0
└─┬ @lexical/markdown@0.35.0
└─┬ @lexical/code@0.35.0
└── prismjs@1.30.0

\n## pnpm why prismjs
\n---\n
prismjs@1.30.0
node_modules/prismjs
prismjs@"^1.30.0" from @lexical/code@0.35.0
node_modules/@lexical/code
@lexical/code@"0.35.0" from @lexical/markdown@0.35.0
node_modules/@lexical/markdown
@lexical/markdown@"0.35.0" from @lexical/react@0.35.0
node_modules/@lexical/react
@lexical/react@"^0.35.0" from @mdxeditor/editor@3.47.0
node_modules/@mdxeditor/editor
@mdxeditor/editor@"^3.39.1" from the root project
@lexical/markdown@"^0.35.0" from @mdxeditor/editor@3.47.0
node_modules/@mdxeditor/editor
@mdxeditor/editor@"^3.39.1" from the root project
