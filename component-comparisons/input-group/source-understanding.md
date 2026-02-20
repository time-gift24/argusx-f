# input-group Source Understanding

## Mapping
- local: `input-group`
- zardui: `input-group`
- shadcn: `input-group` (`radix-mira` style, `input-group-example` preview)
- rationale: 对外 API 冲突严格采用 shadcn；仅保留不冲突的 ArgusX plain 扩展（`size/disabled/loading`）。
- note: 当前环境无 `mcp__shadcn__*`，改用 shadcn 官方仓库导出的 registry JSON + 源码内容。

## Shadcn Evidence (Target API Primary)
| id | file | lines | note |
| --- | --- | --- | --- |
| S1 | `/tmp/shadcn-ui-argusx-input-group/apps/v4/public/r/styles/radix-mira/registry.json` | 1101-1124 | `input-group-example` 在 radix-mira registry 中注册。 |
| S2 | `/tmp/shadcn-radix-mira-input-group.tsx` | 11-23 | 根容器契约：`data-slot="input-group"`、`role="group"`、mira 基线类（`bg-input/20`、`h-7`、`ring-2`）。 |
| S3 | `/tmp/shadcn-radix-mira-input-group.tsx` | 25-42 | addon `align` 四态与默认 `inline-start`。 |
| S4 | `/tmp/shadcn-radix-mira-input-group.tsx` | 44-60 | addon 点击聚焦语义：忽略按钮点击，非按钮点击聚焦第一个 `input`。 |
| S5 | `/tmp/shadcn-radix-mira-input-group.tsx` | 66-100 | `InputGroupButton` 默认 `variant="ghost"`、`size="xs"`。 |
| S6 | `/tmp/shadcn-radix-mira-input-group-example.tsx` | 511-559 | `With Kbd` 组合：`⌘K/Tab/Ctrl+C` + inline start/end addon。 |
| S7 | `/tmp/shadcn-radix-mira-input-group-example.tsx` | 598-614 | `With Kbd` 中 disabled 场景（`data-disabled` + disabled input）。 |
| S8 | `/tmp/shadcn-radix-mira-input-group-example.tsx` | 647-659 | `With Kbd` 中 loading 场景（addon 内 `Spinner`）。 |

## ZardUI Evidence
| id | file | lines | note |
| --- | --- | --- | --- |
| Z1 | `/tmp/zardui/libs/zard/src/lib/shared/components/input-group/input-group.component.ts` | 75-80 | `zAddonBefore/zAddonAfter/zAddonAlign/zDisabled/zLoading/zSize` 输入定义。 |
| Z2 | `/tmp/zardui/libs/zard/src/lib/shared/components/input-group/input-group.component.ts` | 117-127 | 通过 `effect()` 向内部控件同步 size/disabled，并注入 `data-slot=input-group-control`。 |
| Z3 | `/tmp/zardui/libs/zard/src/lib/shared/components/input-group/input-group.component.ts` | 64-70 | group 暴露 `aria-disabled/data-disabled/aria-busy`。 |
| Z4 | `/tmp/zardui/libs/zard/src/lib/shared/components/input-group/input-group.variants.ts` | 19-33,105-131 | `zSize/zDisabled` 变体体系与输入控件联动。 |

## Usage Evidence (Doc + Demo)
| id | file | lines | scenario |
| --- | --- | --- | --- |
| U1 | `/tmp/zardui/libs/zard/src/lib/shared/components/input-group/doc/api.md` | 7-15 | 文档声明 `zDisabled/zLoading/zSize` 语义与默认值。 |
| U2 | `/tmp/zardui/libs/zard/src/lib/shared/components/input-group/demo/size.ts` | 11-21 | `sm/default/lg` 尺寸演示。 |
| U3 | `/tmp/zardui/libs/zard/src/lib/shared/components/input-group/demo/loading.ts` | 12-15 | loading 场景使用 group 级开关。 |
| U4 | `/tmp/zardui/libs/zard/src/lib/shared/components/input-group/demo/default.ts` | 24-34 | before/after addon 的复杂组合。 |

## Local Baseline Evidence (After Rewrite)
| id | file | lines | current behavior |
| --- | --- | --- | --- |
| L1 | `src/app/shared/ui/input-group/input-group.component.ts` | 52-114 | 根节点类名对齐 radix-mira 基线；保留 `data-disabled/aria-busy` 与 `size` 扩展。 |
| L2 | `src/app/shared/ui/input-group/input-group-addon.component.ts` | 66-77 | 点击 addon 时仅聚焦首个 `input`，行为与 shadcn 一致。 |
| L3 | `src/app/shared/ui/input-group/input-group-input.component.ts` | 26-72 | 控件支持 `id` 透传到真实 input，并继承 group `disabled/loading/size`。 |
| L4 | `src/app/shared/ui/input-group/input-group-textarea.component.ts` | 26-74 | textarea 支持 `id` 透传，并继承 group `disabled/loading/size`。 |
| L5 | `src/app/preview/input-group-preview.component.ts` | 94-141 | preview 新增 `With Kbd (item=kbd-example)` 对标场景。 |
| L6 | `src/app/shared/ui/input-group/input-group.component.spec.ts` | 24-41 | 单测覆盖 mira 根样式基线与 `id` 透传契约。 |
