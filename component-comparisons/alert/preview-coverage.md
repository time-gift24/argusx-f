# alert Preview Coverage

## Required Scenarios
- [x] all conflict APIs with shadcn-aligned behavior
- [x] all non-conflict extension APIs in plain style
- [x] all key state combinations
- [x] shadcn preview parity examples
- [x] one complex combined scenario

## Preview Coverage Details

### Conflict APIs (shadcn-aligned)
- 基线默认态：icon + title + description（`Shadcn Baseline` 第一项）
- 基线标题-only：icon + title（`Shadcn Baseline` 第二项）
- destructive 场景：icon + title + rich description(list)（`Shadcn Baseline` 第三项）

### ArgusX Plain Extensions
- semantic variants：`info` / `warning` / `success`（`ArgusX Plain Extensions`）
- plain + extension 叠加：`variant="plain"` + `argusx-alert-action`（`ArgusX Plain Extensions` 第四项）
- action slot 组合：按钮组与 badge 操作区（`Complex Combination`）

### Key States
- title + description
- title-only
- destructive + list content
- plain + action slot
- semantic variant states (`info`/`warning`/`success`)

### Complex Combined Scenario
- `warning` + icon + title + rich description(list) + `argusx-alert-action` + badge + multi-button actions

## Local Preview Routes
- main: `/preview?component=alert`
- reference: `https://ui.shadcn.com/preview/radix/alert-example`

## Verification Notes
- build: `npm run build` passed (warnings in unrelated markdown/mermaid CommonJS deps and markdown CSS budget)
- tests: `npx vitest run src/app/shared/ui/alert/alert.component.spec.ts` passed (3/3)
- manual check: not executed in this session
