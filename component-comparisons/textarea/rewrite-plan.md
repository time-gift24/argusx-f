# textarea Rewrite Plan

## Conflict Resolution (Must Adopt shadcn)
- [x] 锁定 shadcn textarea 主路径：原生 `textarea` API + `data-slot="textarea"` + `aria-invalid` 视觉契约。
- [x] 删除冲突主入口 `<app-textarea>`，改为 `textarea[argusxTextarea]` directive。
- [x] preview 对齐 create 页的 `textarea-example` 分组（Basic/Invalid/With Label/With Description/Disabled）。

## Non-conflict Extensions (ArgusX Plain)
- [x] 定义扩展 API：`argusxVariant/argusxSize/argusxStatus`。
- [x] 扩展仅叠加样式，不改变 shadcn 原生 props 主语义。
- [x] 默认 `argusxVariant='plain'`，扩展场景保持 plain 风格。

## Breaking Rewrite Policy (No Compatibility Layer)
- [x] 移除 legacy 文件 `src/app/shared/ui/textarea/textarea.component.ts`。
- [x] 移除 `TextareaComponent` 兼容入口，不保留 deprecated alias。
- [x] 统一单一路径：`ArgusxTextareaDirective`。

## Naming Migration (z -> argusx)
- [x] selector 迁移：`textarea[z-input]`（参考来源）与 `app-textarea`（本地）统一为 `textarea[argusxTextarea]`。
- [x] 输入命名迁移：`zBorderless/zSize/zStatus` -> `argusxVariant/argusxSize/argusxStatus`。
- [x] 类型符号迁移：`TextareaStatus` -> `ArgusxTextareaStatus`（并补 `ArgusxTextareaVariant/Size`）。
- [x] `index.ts` 改为仅导出 directive + 类型 + variants。

## shadcn API Alignment
- [x] API surface：透传原生 textarea 属性，非原生能力以 `argusx*` 扩展表达。
- [x] behavior：`input/blur/writeValue/setDisabledState` 对齐原生 + CVA。
- [x] accessibility：`aria-invalid` 视觉反馈、label/description 场景在 preview 覆盖。

## Plain Style Alignment
- [x] 默认 variant 为 `plain`（`argusxVariant='plain'`）。
- [x] 默认样式不引入强装饰，仅使用 token（`border-input/ring/destructive`）。
- [x] 扩展状态同样保持 plain 信息表达，不引入品牌色硬编码。

## File-level Execution
1. `src/app/shared/ui/textarea/textarea.directive.ts`  
   新增 `ArgusxTextareaDirective`（shadcn baseline + ArgusX plain 扩展 + CVA）。
2. `src/app/shared/ui/textarea/index.ts`  
   导出入口切换到 directive/types/variants。
3. `src/app/shared/ui/textarea/textarea.component.ts`  
   已删除旧包装组件。
4. `src/app/preview/textarea-preview.component.ts`  
   复刻 `textarea-example` 预览分组，并新增 ArgusX 扩展与复杂组合。
5. `src/app/shared/ui/textarea/textarea.directive.spec.ts`  
   新增 directive 单测，覆盖 slot/class、扩展 API、Reactive Forms CVA。
