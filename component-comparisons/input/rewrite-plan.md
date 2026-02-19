# input Rewrite Plan

## Conflict Resolution (Must Adopt shadcn)
- [x] 锁定 `input[argusxInput]` 为唯一 public selector。
- [x] 删除冲突 API：`status/size/borderless`、`<app-input>`。
- [x] 对齐 shadcn input class 基线与 `data-slot="input"`。

## Non-conflict Extensions (ArgusX Plain)
- [x] 保留 Angular Forms 所需 CVA（directive 内实现，不暴露额外视觉 API）。
- [x] 保持 default path 不引入品牌化重样式，仍可通过 `class` 叠加样式。

## Breaking Rewrite Policy (No Compatibility Layer)
- [x] 删除 legacy 入口 `input[appInput]`。
- [x] 删除包装组件文件 `src/app/shared/ui/input/input.component.ts`。
- [x] 全仓迁移 `appInput -> argusxInput`，无兼容 alias。

## Naming Migration (z -> argusx)
- [x] selector 迁移：`appInput`/`z-input` 语义收敛为 `argusxInput`。
- [x] class/type symbol 迁移：`InputDirective` -> `ArgusxInputDirective`。
- [x] `index.ts` 导出迁移，仅导出 strict API 所需符号。

## shadcn API Alignment
- [x] API surface：回归原生 `<input>` 属性优先。
- [x] behavior：保留 `aria-invalid`、disabled/readOnly 等状态语义。
- [x] accessibility：沿用原生 input + ARIA 驱动视觉反馈。

## Plain Style Alignment
- [x] 默认样式为普通输入框，无 size/status state machine。
- [x] 默认样式不依赖业务色板，仅使用设计 token。

## File-level Execution
1. `src/app/shared/ui/input/input.directive.ts`  
   已改为 strict shadcn-first 指令并内置 CVA。
2. `src/app/shared/ui/input/index.ts`  
   已移除 wrapper 导出。
3. `src/app/shared/ui/input/input.component.ts`  
   已删除。
4. `src/app/preview/input-preview.component.ts`  
   已改为 shadcn 对齐示例 + complex scenario。
5. 批量调用点迁移  
   `src/app/preview/label-preview.component.ts`  
   `src/app/preview/popover-preview.component.ts`  
   `src/app/preview/dialog-preview.component.ts`  
   `src/app/preview/field-preview.component.ts`  
   `src/app/preview/card-preview.component.ts`  
   `src/app/preview/select-preview.component.ts`  
   `src/app/shared/ui/field/field.component.ts`  
   `src/app/shared/ui/field/field-label.component.ts`  
   `src/app/shared/ui/field/field-description.component.ts`  
   `src/app/shared/ui/field/field-content.component.ts`
