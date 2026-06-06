# prd-to-solution

Generate comprehensive technical solution documents from Product Requirements Documents for technical review.

## Use When

- You need a full technical proposal document.
- You want architecture, sequence diagrams, test plan, risks, and rollout notes.
- You want output saved under `~/Documents/solution/`.

## Script Usage

```bash
npx tsx skills/prd-to-solution/scripts/generate.ts "User Order System"
npx tsx skills/prd-to-solution/scripts/generate.ts "User Order System" --analyze
npx tsx skills/prd-to-solution/scripts/generate.ts "Payment Platform" --version v2.0 --author "John Doe"
```

## Contents

```text
SKILL.md
package.json
references/solution-template.md
scripts/generate.ts
scripts/lib/
```
