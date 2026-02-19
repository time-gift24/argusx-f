# popover Preview Coverage

## Required Scenarios
- [x] all conflict APIs with shadcn-aligned behavior
  - `Shadcn Baseline`：`src/app/preview/popover-preview.component.ts:37-62`
  - `Side + Align + Offset`：`src/app/preview/popover-preview.component.ts:64-86`
- [x] all non-conflict extension APIs in plain style
  - `ArgusX Extension Variant`：`src/app/preview/popover-preview.component.ts:117-140`
  - `variant='plain'` baseline + `variant='glass'` extension 并列展示
- [x] all key state combinations
  - controlled open/close：`src/app/preview/popover-preview.component.ts:88-115`
  - disabled trigger guard：`src/app/preview/popover-preview.component.ts:185-194`
- [x] shadcn preview parity examples
  - dimensions form + `w-80` content：`src/app/preview/popover-preview.component.ts:39-60`
  - 对标参考：`/tmp/shadcn-popover-demo.tsx:12-59`
- [x] one complex combined scenario
  - anchor + controlled open + side/align/offset + glass variant：`src/app/preview/popover-preview.component.ts:142-183`

## Local Preview Routes
- main: `/preview?component=popover`
- reference: `https://ui.shadcn.com/preview/radix/popover-example`

## Verification Notes
- build: `npm run ng -- build` passed（2026-02-19，存在项目已有 CommonJS/budget warnings，非本次 popover 改造引入）
- tests: skipped（无 `src/app/shared/ui/popover/**/*.spec.ts`）
- manual check: pending（需浏览器打开 `/preview?component=popover` 逐项核对）
