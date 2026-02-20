# input-group Rewrite Plan

## Conflict Resolution (Must Adopt shadcn)
- [x] 锁定 shadcn 组合式主路径：`InputGroup + Addon + Input/Textarea + Button + Text`。
- [x] 锁定 `align` 四态枚举：`inline-start/inline-end/block-start/block-end`。
- [x] 锁定 `InputGroupButton` 默认值：`variant="ghost" + size="xs"`。
- [x] 锁定 radix-mira 根样式基线：`bg-input/20`、`h-7`、`ring-2`。
- [x] 锁定 addon click 行为：非按钮点击仅聚焦第一个 `input`。

## Non-conflict Extensions (ArgusX Plain)
- [x] 保留 group 级 `disabled/loading/size(sm/default/lg)` 扩展。
- [x] 通过 `ARGUSX_INPUT_GROUP_CONTEXT` 传播扩展状态到 input/textarea/button。
- [x] 扩展默认态保持 plain：无重阴影、无渐变、无玻璃化。

## Breaking Rewrite Policy (No Compatibility Layer)
- [x] 不保留 `zAddonBefore/zAddonAfter` 兼容入口。
- [x] 不引入 deprecated alias 或双轨 API。

## Naming Migration (z -> argusx)
- [x] selectors 已统一为 `argusx-*`（button 采用 `button[argusxInputGroupButton]`）。
- [x] `src/app/shared/ui/input-group/index.ts` 保持单一对外导出入口。

## shadcn API Alignment
- [x] 对齐 `data-slot` 主结构（group/addon/control/button）。
- [x] 对齐 addon click-focus 语义（input-only focus）。
- [x] 对齐 `id` 在 `InputGroupInput/Textarea` 的语义传递能力。
- [x] 对齐 `item=kbd-example` 主场景在 preview 的呈现。

## Plain Style Alignment
- [x] 默认尺寸走 shadcn baseline（`size=default` -> h-7）。
- [x] `sm/lg` 作为 plain 扩展，不破坏主路径语义。
- [x] 状态反馈仅使用中性 token（`border-input`、`text-muted-foreground` 等）。

## File-level Plan
1. `src/app/shared/ui/input-group/input-group.component.ts`: 根样式基线对齐 + 扩展状态收口。
2. `src/app/shared/ui/input-group/input-group-addon.component.ts`: 点击聚焦语义对齐 shadcn。
3. `src/app/shared/ui/input-group/input-group-input.component.ts`: `id` 透传与 host id 清理。
4. `src/app/shared/ui/input-group/input-group-textarea.component.ts`: `id` 透传与 host id 清理。
5. `src/app/preview/input-group-preview.component.ts`: 补齐 `With Kbd` 对标场景。
6. `src/app/shared/ui/input-group/input-group.component.spec.ts`: 增加根样式基线与 `id` 透传验证。
