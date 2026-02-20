# input-group Preview Coverage

## Required Scenarios
- [x] all conflict APIs with shadcn-aligned behavior
- [x] inline addons: `inline-start/inline-end`
- [x] block addons: `block-start/block-end` + textarea
- [x] button defaults and variants (`ghost/xs`, `secondary/sm`, `icon-xs`)
- [x] shadcn preview parity: `item=kbd-example` 主链路（`⌘K/Tab/Ctrl+C/disabled/loading`）
- [x] all non-conflict extension APIs in plain style (`size`, `disabled`, `loading`)
- [x] one complex combined scenario (`size=lg + loading + block-start + block-end + textarea + buttons`)

## Local Preview Routes
- main: `/preview?component=input-group`
- nav item: `src/app/preview/preview-layout.component.ts`
- reference: `https://ui.shadcn.com/preview/radix/input-group-example?item=kbd-example&style=mira&theme=cyan&font=nunito-sans&menuAccent=bold&radius=medium&template=vite`

## Verification Notes
- build: `npm run build` PASSED (2026-02-19, 23:45 local); existing global warnings about markdown CSS budget and CommonJS deps remain
- tests: `npx vitest run src/app/shared/ui/input-group/input-group.component.spec.ts` PASSED (2/2); `npx ng test --watch=false --include=\"src/app/shared/ui/input-group/**/*.spec.ts\"` not supported in this workspace (`Unknown arguments: watch, include`)
- manual check: not executed in this CLI session
