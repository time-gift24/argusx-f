# popover Source Understanding

## Mapping
- local: `popover`
- zardui: `popover`
- shadcn: `popover`
- rationale: 名称一一对应，不需要映射重命名。以 shadcn 的 public API 为主轨，复用 zardui 已验证的 overlay/placement 实现思路。

## ZardUI Evidence
| id | file | lines | note |
| --- | --- | --- | --- |
| Z1 | `/tmp/zardui/libs/zard/src/lib/shared/components/popover/popover.component.ts` | 68-93 | zardui 主入口是 `[zPopover]` 指令，公开 `zTrigger/zContent/zPlacement/zVisible` 等输入和 `zVisibleChange` 输出。 |
| Z2 | `/tmp/zardui/libs/zard/src/lib/shared/components/popover/popover.component.ts` | 101-110, 137-160 | 受控可见性通过 `zVisible` 同步到内部 `isVisible`，`show/hide` 会发射状态变更。 |
| Z3 | `/tmp/zardui/libs/zard/src/lib/shared/components/popover/popover.component.ts` | 201-213 | 触发模式支持 `click` 和 `hover`。 |
| Z4 | `/tmp/zardui/libs/zard/src/lib/shared/components/popover/popover.component.ts` | 33-66, 223-359 | placement 与 fallback 的定位映射已经完整覆盖四个方向。 |
| Z5 | `/tmp/zardui/libs/zard/src/lib/shared/components/popover/popover.variants.ts` | 3-5 | 默认内容样式包含 `w-72`、`rounded-md`、`border`、`shadow` 和 `data-[state|side]` 动画类。 |

## Usage Evidence (Doc + Demo)
| id | file | lines | scenario |
| --- | --- | --- | --- |
| U1 | `/tmp/zardui/apps/web/public/components/popover/doc/api.md` | 7-20 | zardui API 文档确认默认 `zTrigger='click'`、`zPlacement='bottom'`、`zOverlayClickable=true`。 |
| U2 | `/tmp/zardui/apps/web/public/components/popover/demo/default.md` | 12-21 | 标准使用方式是按钮触发 + 内容模板。 |
| U3 | `/tmp/zardui/apps/web/public/components/popover/demo/hover.md` | 12-20 | 展示 `zTrigger='hover'` 的行为。 |
| U4 | `/tmp/zardui/apps/web/public/components/popover/demo/placement.md` | 13-21 | 展示 top/left/right/bottom 的 placement 组合。 |
| U5 | `/tmp/shadcn-popover.tsx` | 20-35 | shadcn 内容默认值：`align="center"`、`sideOffset=4`，并带完整 `data-slot`/动画样式契约。 |
| U6 | `/tmp/shadcn-popover.tsx` | 8-18, 42-46, 48-79 | shadcn 公开 Root/Trigger/Content/Anchor/Header/Title/Description 的完整导出族。 |
| U7 | `/tmp/shadcn-popover-demo.tsx` | 12-17 | shadcn 示例采用 `PopoverTrigger asChild` + `PopoverContent className="w-80"` 主路径。 |

## Local Baseline Evidence
| id | file | lines | current behavior |
| --- | --- | --- | --- |
| L1 | `/tmp/argusx-popover-before-rewrite.ts` | 52-59, 210-217, 254-255 | 本地原实现使用 `app-*` 选择器与 `[appPopoverTrigger]`。 |
| L2 | `/tmp/argusx-popover-before-rewrite.ts` | 85-88, 262-265 | 本地原实现把 `align/side/sideOffset` 放在 root，而非 content。 |
| L3 | `/tmp/argusx-popover-before-rewrite.ts` | 286-317 | 本地原扩展是 `glass:boolean`，不是 `variant`。 |
| L4 | `/tmp/argusx-popover-before-rewrite.ts` | 341-343, 367-369 | Header/Title 默认字体级别与 shadcn 不一致（`text-xs`、`text-sm font-medium`）。 |
| L5 | `/tmp/argusx-popover-preview-before-rewrite.ts` | 18-47 | preview 仅覆盖单一 happy-path，缺少冲突项、扩展项和复杂组合。 |
