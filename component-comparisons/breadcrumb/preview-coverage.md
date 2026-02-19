# breadcrumb Preview Coverage

## Required Scenarios
- [x] all primary input enums
  - `size`: `sm | md | lg`
  - `align`: `start | center | end`（preview 至少展示 `center`，其余由 spec 验证）
  - `wrap`: `wrap | nowrap`
  - `ellipsisColor`: `muted | strong`
- [x] all key state combinations
  - default separator + custom separator（icon / text）
  - component selectors + semantic selectors 双路径
- [x] shadcn preview parity examples
  - default path hierarchy
  - custom separator
  - ellipsis + dropdown
- [x] one complex combined scenario
  - runtime responsive：desktop dropdown / mobile drawer fallback（`matchMedia('(min-width: 768px)')`）

## Local Preview Routes
- main: `/preview?component=breadcrumb`
- reference: `https://ui.shadcn.com/preview/radix/breadcrumb-example`

## Verification Notes
- build: ✅ `npm run build`（通过；存在仓库既有 CommonJS 依赖 warning，与 breadcrumb 改造无关）
- tests: ✅ `npx vitest run src/app/shared/ui/breadcrumb/**/*.spec.ts`（5/5 通过）
- manual check:
  - ⏳ 未在本次终端会话内进行浏览器人工验收
  - 建议打开 `/preview?component=breadcrumb` 逐项确认：default / semantic+custom separator / size / align+wrap / ellipsisColor / responsive complex
