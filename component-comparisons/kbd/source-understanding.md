# kbd Source Understanding

## Mapping
- local: `kbd`
- zardui: `kbd`
- shadcn: `kbd`
- rationale: 三方都属于键盘按键展示组件；本次采用 `shadcn` 作为 public API 基线，复用 zardui 的稳定实现思路（kbd/kbd-group 双原语 + tooltip 场景样式），并迁移到 ArgusX 命名。

## shadcn Evidence (Target API Primary)
| id | file | lines | note |
| --- | --- | --- | --- |
| S1 | `/tmp/shadcn-kbd.tsx` | 3-15 | `Kbd` 公开形态：`className + native <kbd> props`，输出 `data-slot="kbd"`。 |
| S2 | `/tmp/shadcn-kbd.tsx` | 18-25 | `KbdGroup` 输出 `data-slot="kbd-group"`，默认 `inline-flex items-center gap-1`。 |
| S3 | `/tmp/shadcn-kbd.tsx` | 8-11 | 核心样式基线：`rounded-sm`、`text-xs`、tooltip context 样式。 |
| S4 | `/tmp/shadcn-kbd-examples.tsx` | 48-57 | `kbd-button` 示例：按钮内组合 `Kbd`。 |
| S5 | `/tmp/shadcn-kbd-examples.tsx` | 80-100 | `kbd-tooltip` 示例：tooltip 内容内 `Kbd`/`KbdGroup` 组合。 |
| S6 | `/tmp/shadcn-kbd-examples.tsx` | 120-130 | `kbd-input-group` 示例：`InputGroupAddon` 内显示快捷键。 |

## ZardUI Evidence
| id | file | lines | note |
| --- | --- | --- | --- |
| Z1 | `/tmp/zardui/libs/zard/src/lib/shared/components/kbd/kbd.component.ts` | 10-20 | `z-kbd` / `[z-kbd]` selector + host class 绑定模式。 |
| Z2 | `/tmp/zardui/libs/zard/src/lib/shared/components/kbd/kbd.variants.ts` | 3-5 | `kbd` 基础 class（含 tooltip context 样式）与 group 变体定义。 |
| Z3 | `/tmp/zardui/libs/zard/src/lib/shared/components/kbd/kbd-group.component.ts` | 10-20 | `z-kbd-group` / `[z-kbd-group]` 作为独立原语。 |
| Z4 | `/tmp/zardui/libs/zard/src/lib/shared/components/kbd/index.ts` | 1-3 | `kbd / kbd-group / variants` 统一导出结构。 |

## Usage Evidence (Doc + Demo)
| id | file | lines | scenario |
| --- | --- | --- | --- |
| U1 | `/tmp/zardui/apps/web/public/components/kbd/doc/api.md` | 7-17 | `z-kbd` 与 `z-kbd-group` 公开输入仅 `class`。 |
| U2 | `/tmp/zardui/libs/zard/src/lib/shared/components/kbd/demo/default.ts` | 11-21 | 单键 + 按钮组合场景。 |
| U3 | `/tmp/zardui/libs/zard/src/lib/shared/components/kbd/demo/group.ts` | 11-17 | `kbd-group` 组合多个按键文本。 |
| U4 | `/tmp/zardui/libs/zard/src/lib/shared/components/kbd/demo/tooltip.ts` | 16-22 | tooltip 内容内按键组合与定制 class 用法。 |

## Local Baseline Evidence
| id | file | lines | current behavior |
| --- | --- | --- | --- |
| L1 | `/Users/wanyaozhong/.codex/worktrees/bda7/argusx-f/src/app/shared/ui/kbd/kbd.directive.ts` | 31-45 | `kbd[argusx-kbd]` 对齐 shadcn 基线并输出 `data-slot="kbd"`/`data-size`。 |
| L2 | `/Users/wanyaozhong/.codex/worktrees/bda7/argusx-f/src/app/shared/ui/kbd/kbd.directive.ts` | 62-73 | `kbd[argusx-kbd-group]` 对齐 `KbdGroup` 默认结构与 `data-slot="kbd-group"`。 |
| L3 | `/Users/wanyaozhong/.codex/worktrees/bda7/argusx-f/src/app/shared/ui/kbd/index.ts` | 1-6 | 仅导出 ArgusX 命名 API（无兼容 alias）。 |
| L4 | `/Users/wanyaozhong/.codex/worktrees/bda7/argusx-f/src/app/preview/kbd-preview.component.ts` | 24-129 | preview 覆盖 shadcn baseline、tooltip/input-group 场景与 ArgusX size 扩展。 |
