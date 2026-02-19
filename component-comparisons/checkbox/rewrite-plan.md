# checkbox Rewrite Plan

## Conflict Resolution (Must Adopt shadcn)
- [x] 锁定 shadcn 主路径 API：`checked/defaultChecked/disabled/name/value/required/id + checkedChange`
- [x] 移除本地 `app-checkbox` selector 与 `checkbox-wrapper` slot
- [x] 修复 CVA disable（`setDisabledState`）并与 `disabled` 合流

## Non-conflict Extensions (ArgusX Plain)
- [x] 定义扩展 API：`variant(plain|destructive)`, `size(default|lg)`, `shape(default|circle|square)`
- [x] 确保扩展不重定义 shadcn 既有语义（checked/disabled/state）
- [x] 默认 `variant=plain`，并收敛为低装饰视觉

## Breaking Rewrite Policy (No Compatibility Layer)
- [x] 删除旧 selector 与旧 symbol 导出，不保留 alias
- [x] 仅保留 `argusx-checkbox` 单一对外入口

## Naming Migration (z -> argusx)
- [x] selector: `z-checkbox`/`app-checkbox` -> `argusx-checkbox`
- [x] type symbol: `Checkbox*` -> `ArgusxCheckbox*`
- [x] index 仅导出 `ArgusxCheckboxComponent` 及 ArgusX 类型

## shadcn API Alignment
- [x] API 面：受控 + 非受控 (`checked/defaultChecked`) 与 `checkedChange`
- [x] 行为面：`data-slot`/`data-state` 与 class 合并策略
- [x] 可访问性：`role=checkbox`、`aria-checked` mixed、键盘交互

## Plain Style Alignment
- [x] 默认 `variant=plain`
- [x] 默认态去掉重阴影/高噪点动效
- [x] 使用设计 token（`primary`/`border-input`），不内置品牌硬编码色

## File-level Execution Log
1. `src/app/shared/ui/checkbox/checkbox.variants.ts`
- 新建 ArgusX plain 变体矩阵，定义 `variant/size/shape`。
2. `src/app/shared/ui/checkbox/checkbox.component.ts`
- 组件重写为 `argusx-checkbox`。
- 落地 shadcn 对齐 API（`checked/defaultChecked/...`）与 `checkedChange`。
- 复用 zardui 的 form-disabled 合流实现（`disabledByForm`）。
3. `src/app/shared/ui/checkbox/index.ts`
- 切换为 ArgusX 符号导出；移除旧导出。
4. `src/app/preview/checkbox-preview.component.ts`
- 重建 preview 场景，覆盖 shadcn baseline、扩展 API、关键状态与复杂组合。
