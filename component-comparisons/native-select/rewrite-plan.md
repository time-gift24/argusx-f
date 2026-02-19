# native-select Rewrite Plan

## Current Status
本地实现已经基本符合 shadcn API 规范，使用 directive 方式实现（而非组件方式），但语义一致。

## Conflict Resolution (Must Adopt shadcn)
- [x] 无冲突项需要解决

## Non-conflict Extensions (ArgusX Plain)
- [x] size 变体已实现
- [x] icon 扩展已实现

## Breaking Rewrite Policy (No Compatibility Layer)
- [x] 当前实现已经是单一 API 路径

## Naming Migration (z -> argusx)
- [x] selector 使用 `appNativeSelect*` 前缀（已符合项目规范）

## shadcn API Alignment
- [x] API surface alignment - 指令语义与 shadcn 组件一致
- [x] behavior alignment - 使用原生 select 行为
- [x] accessibility alignment - 支持 aria-invalid

## Plain Style Alignment
- [x] 默认 variant 是 plain
- [x] 避免装饰性样式
- [x] 使用 CSS 变量和 Tailwind 工具类

## File-level Plan
1. 保持 `src/app/shared/ui/native-select/native-select.directive.ts`
2. 保持 `src/app/shared/ui/native-select/index.ts`
3. 更新 `src/app/preview/native-select-preview.component.ts` 覆盖更多场景

## Actions Needed
- [ ] 更新 preview 覆盖 disabled 和 invalid 场景
