# toast Rewrite Plan

## Conflict Resolution (Must Adopt shadcn)
- [x] selector prefix: 迁移到 argusx- 前缀

## Non-conflict Extensions (ArgusX Plain)
- [x] toast type: 保留 success/error/warning/info/loading，添加 plain variant
- [x] service methods: 保留 success/error/warning/info/loading 快捷方法
- [x] plain style: 使用 minimal shadows 和无 gradient

## Breaking Rewrite Policy (No Compatibility Layer)
- [x] 移除 app-toast-* 旧 selector
- [x] 保留单一 canonical API

## Naming Migration (app -> argusx)
- [x] app-toast-item -> argusx-toast-item
- [x] app-toast-container -> argusx-toast-container
- [x] app-toaster -> argusx-toaster

## shadcn API Alignment
- [x] selector 迁移
- [x] data attributes 对齐
- [x] accessibility 对齐 (role="alert", aria-live)

## Plain Style Alignment
- [x] 默认样式为 plain
- [x] 使用 CSS 变量而非硬编码颜色

## File-level Plan
1. `src/app/shared/ui/toast/toast.component.ts` - 更新 selector
2. `src/app/shared/ui/toast/toast.service.ts` - 可能需要更新
3. `src/app/shared/ui/toast/index.ts` - 更新导出
4. `src/app/preview/toast-preview.component.ts` - 更新预览
