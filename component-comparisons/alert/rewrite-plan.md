# alert Rewrite Plan

## Conflict Resolution (Must Adopt shadcn)
- [x] lock shadcn naming/default/behavior for conflict APIs
- [x] remove conflicting local/zardui primary entries

## Non-conflict Extensions (ArgusX Plain)
- [x] define extension API and naming
- [x] ensure extension does not break shadcn main path
- [x] set plain default style behavior

## Breaking Rewrite Policy (No Compatibility Layer)
- [x] remove legacy API entrances and deprecated aliases
- [x] keep single canonical API path only

## Naming Migration (z -> argusx)
- [x] selector migration
- [x] input/output/type symbol migration
- [x] index export migration

## shadcn API Alignment
- [x] API surface alignment
- [x] behavior alignment
- [x] accessibility alignment

## Plain Style Alignment
- [x] default variant/style is plain
- [x] avoid heavy decoration in default state
- [x] verify token usage and no hardcoded brand colors in component internals

## File-level Plan
- [x] `src/app/shared/ui/alert/alert.component.ts`
  - 对齐 shadcn root class/slot/a11y contract，默认 variant 改为 `plain`，移除无效 `close` output。
- [x] `src/app/shared/ui/alert/alert-title.component.ts`
  - 标题 class 收敛到 shadcn `line-clamp-1 min-h-4 font-medium tracking-tight`。
- [x] `src/app/shared/ui/alert/alert-description.component.ts`
  - 描述 class 收敛到 shadcn `text-muted-foreground ... [&_p]:leading-relaxed`。
- [x] `src/app/shared/ui/alert/alert-action.component.ts`
  - 保留 ArgusX action 插槽扩展并清理过时示例注释。
- [x] `src/app/shared/ui/alert/alert.component.spec.ts`
  - 新增组件测试，覆盖默认 plain、destructive variant class contract 与 slot contract。
- [x] `src/app/preview/alert-preview.component.ts`
  - 覆盖 shadcn 主路径场景 + ArgusX plain 扩展场景 + 复杂组合场景。
- [x] `src/app/shared/ui/alert/alert.component.html`
  - 删除（组件改为内联模板，无外部模板依赖）。
