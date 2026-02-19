# input-group Rewrite Plan

## Conflict Resolution (Must Adopt shadcn)
- [x] selector: `app-input-group` -> `argusx-input-group`
- [x] 子组件 selector: `app-input-group-addon` -> `argusx-input-group-addon`
- [x] 子组件 selector: `app-input-group-button` -> `argusx-input-group-button`
- [x] 子组件 selector: `app-input-group-text` -> `argusx-input-group-text`
- [x] 子组件 selector: `app-input-group-input` -> `argusx-input-group-input`
- [x] 子组件 selector: `app-input-group-textarea` -> `argusx-input-group-textarea`

## Non-conflict Extensions (ArgusX Plain)
- [x] 在 InputGroupComponent 添加 `disabled` input
- [x] 在 InputGroupComponent 添加 `loading` input
- [x] 在 InputGroupComponent 添加 `size` input
- [x] 保持 plain 默认样式

## Breaking Rewrite Policy (No Compatibility Layer)
- [x] 移除旧 `app-*` selector 的兼容入口
- [x] 保持单一 canonical API

## Naming Migration (argusx 前缀)
- [x] selector 迁移
- [x] index.ts 导出迁移

## shadcn API Alignment
- [x] API 表面对齐
- [x] data attributes 对齐
- [x] accessibility 对齐

## Plain Style Alignment
- [x] 默认样式为 plain
- [x] 避免强装饰
- [x] 使用主题变量

## File-level Plan
1. `src/app/shared/ui/input-group/input-group.component.ts` - 更新 selector 和添加扩展 API
2. `src/app/shared/ui/input-group/input-group-addon.component.ts` - 更新 selector
3. `src/app/shared/ui/input-group/input-group-button.component.ts` - 更新 selector
4. `src/app/shared/ui/input-group/input-group-text.component.ts` - 更新 selector
5. `src/app/shared/ui/input-group/input-group-input.component.ts` - 更新 selector
6. `src/app/shared/ui/input-group/input-group-textarea.component.ts` - 更新 selector
7. `src/app/shared/ui/input-group/index.ts` - 更新导出
8. `src/app/preview/input-group-preview.component.ts` - 更新使用
