# collapsible Source Understanding

## Mapping
- local: `collapsible`
- zardui: `N/A` (closest behavior source: `accordion` / `accordion-item`)
- shadcn: `collapsible`
- rationale: zardui component目录不存在 `collapsible`（见 Z1），因此按映射规则保留 `N/A` 并选取最接近“单区块展开/收起”行为的 `accordion-item` 作为实现参考（见 Z2/Z3/U1）。

## shadcn Evidence
| id | file | lines | note |
| --- | --- | --- | --- |
| S1 | `/tmp/shadcn-collapsible.json` (extracted `registry/new-york-v4/ui/collapsible.tsx`) | 5-33 | Root/Trigger/Content 三段 API，统一透传 props，并固定 `data-slot`：`collapsible` / `collapsible-trigger` / `collapsible-content`。 |
| S2 | `/tmp/shadcn-collapsible-demo.json` (extracted `registry/new-york-v4/examples/collapsible-demo.tsx`) | 17-37 | 官方示例主路径是 `open + onOpenChange` 控制态，Trigger 支持 `asChild` 包裹 Button。 |

## ZardUI Evidence
| id | file | lines | note |
| --- | --- | --- | --- |
| Z1 | `/tmp/zardui/libs/zard/src/lib/shared/components` | 1-44 | 组件列表无 `collapsible` 目录，确认无直接同名实现。 |
| Z2 | `/tmp/zardui/libs/zard/src/lib/shared/components/accordion/accordion-item.component.ts` | 18-40, 50-53 | trigger/content 结构中包含 `aria-controls`、`aria-expanded`、`role=region`、`data-state`，可复用可访问性和状态标记思路。 |
| Z3 | `/tmp/zardui/libs/zard/src/lib/shared/components/accordion/accordion.variants.ts` | 21-31 | 内容区用 `grid-rows-[1fr/0fr] + transition-all` 做开合动画，适合 plain 基线。 |

## Usage Evidence (Doc + Demo)
| id | file | lines | scenario |
| --- | --- | --- | --- |
| U1 | `/tmp/zardui/libs/zard/src/lib/shared/components/accordion/doc/api.md` | 5-12 | 文档将 accordion 定义为“collapsible content sections”，并给出 `zCollapsible`/`zDefaultValue` 语义。 |
| U2 | `/tmp/zardui/libs/zard/src/lib/shared/components/accordion/demo/basic.ts` | 9-24 | demo 展示默认展开项 + 多 item 组合，佐证“触发器控制内容区展开”的使用形态。 |

## Local Baseline Evidence
| id | file | lines | current behavior |
| --- | --- | --- | --- |
| L1 | `src/app/shared/ui/collapsible/collapsible.component.ts` | 51-57, 71-75, 90-106 | Root 使用 `app-collapsible`，已具备 `open/defaultOpen/disabled/onOpenChange` 与 `data-state` 基础。 |
| L2 | `src/app/shared/ui/collapsible/collapsible.component.ts` + `src/app/preview/collapsible-preview.component.ts` | 137-152 + 21-22 | Trigger 仅声明为元素组件 `app-collapsible-trigger`，但 preview 以属性 `app-collapsible-trigger` 使用，存在 selector/用法不一致。 |
| L3 | `src/app/shared/ui/collapsible/collapsible.component.ts` | 217-219, 260-267 | Content 目前使用 `max-height` 过渡，未提供 shadcn 对齐的 asChild 触发器能力，也无 plain 扩展 API。 |
