# aspect-ratio Preview Coverage

## Required Scenarios
- [x] all conflict APIs with shadcn-aligned behavior
  - `ratio + class` baseline section mirrors shadcn usage (`src/app/preview/aspect-ratio-preview.component.ts:23-33`)
- [x] all non-conflict extension APIs in plain style
  - `variant="subtle"` and `fit` demos on neutral/plain baseline (`src/app/preview/aspect-ratio-preview.component.ts:35-68`)
- [x] all key state combinations
  - ratio states include `1:1`, `3:4`, `16:9`, and invalid ratio fallback (`src/app/preview/aspect-ratio-preview.component.ts:70-84`, `122-127`)
- [x] shadcn preview parity examples
  - baseline uses `ratio=16/9` + rounded muted container + media content (`src/app/preview/aspect-ratio-preview.component.ts:23-33`)
- [x] one complex combined scenario
  - combined `ratio + variant + fit + class` hero/square composition (`src/app/preview/aspect-ratio-preview.component.ts:86-117`)

## Local Preview Routes
- main: `/preview?component=aspect-ratio`
- direct: `/preview/aspect-ratio`
- reference: `https://ui.shadcn.com/preview/radix/aspect-ratio-example`

## Verification Notes
- build:
  - `ng build` passed
  - workspace emits existing CommonJS optimization warnings unrelated to this component (markdown/mermaid deps)
- tests:
  - `ng test --include="src/app/shared/ui/aspect-ratio/**/*.spec.ts"` failed: `Unknown argument: include`
  - `ng test` failed in this workspace: `Cannot determine project or target for command.`
  - executed fallback test command: `npx vitest run src/app/shared/ui/aspect-ratio/aspect-ratio.component.spec.ts` (5/5 passed)
- manual check:
  - launched `ng serve --host 127.0.0.1 --port 4200`
  - opened `http://127.0.0.1:4200/preview?component=aspect-ratio`
  - verified rendered sections: baseline, plain extension, key ratio states, complex composition
