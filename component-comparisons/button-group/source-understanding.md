# button-group Source Understanding

## Mapping
- local: `button-group`
- zardui: `button-group` (`/Users/wanyaozhong/projects/zardui/src/app/shared/components/button-group`)
- shadcn: `button-group`
- rationale: 三方命名一致。以 shadcn 的 public API 作为主契约，以 zardui 的组件/变体实现细节作为内部实现参考。

## shadcn Evidence
| id | file | lines | note |
| --- | --- | --- | --- |
| S1 | `https://ui.shadcn.com/r/styles/radix-mira/button-group.json` (`registry/radix-mira/ui/button-group.tsx`) | 7-23 | mira 风格 `buttonGroupVariants`：nested group gap、single-item 圆角修正、select-trigger 适配、orientation variants。 |
| S2 | `https://ui.shadcn.com/r/styles/radix-mira/button-group.json` (`registry/radix-mira/ui/button-group.tsx`) | 25-39 | `ButtonGroup` 对外 contract：`orientation`、`role="group"`、`data-slot="button-group"`。 |
| S3 | `https://ui.shadcn.com/r/styles/radix-mira/button-group.json` (`registry/radix-mira/ui/button-group.tsx`) | 41-59 | `ButtonGroupText` API：`asChild` 默认 `false`；mira 口径文本样式（`text-xs/relaxed`, `px-2.5`）。 |
| S4 | `https://ui.shadcn.com/r/styles/radix-mira/button-group.json` (`registry/radix-mira/ui/button-group.tsx`) | 61-76 | `ButtonGroupSeparator` API：`orientation` 默认 `vertical`，并使用方向相关 margin/size。 |
| S5 | `https://raw.githubusercontent.com/shadcn-ui/ui/main/apps/v4/content/docs/components/radix/button-group.mdx` | 167-210 | 文档 API 表明确 `ButtonGroup.orientation` 与 `ButtonGroupSeparator.orientation` 默认值，以及 `ButtonGroupText.asChild`。 |
| S6 | `https://ui.shadcn.com/r/styles/radix-mira/button-group-example.json` | `button-group-example.tsx` 全文 | create 页官方完整示例，含 input/text asChild/dropdown/select/nested/vertical 等组合。 |
| S7 | `https://raw.githubusercontent.com/shadcn-ui/ui/main/apps/v4/registry/new-york-v4/examples/button-group-orientation.tsx` | 8-19 | 官方 vertical 方向示例（`orientation="vertical"` + icon buttons）。 |

## ZardUI Evidence
| id | file | lines | note |
| --- | --- | --- | --- |
| Z1 | `/Users/wanyaozhong/projects/zardui/src/app/shared/components/button-group/button-group.component.ts` | 24-50 | 根组件 `z-button-group`，公开 `zOrientation`，host 语义为 `role=group`。 |
| Z2 | `/Users/wanyaozhong/projects/zardui/src/app/shared/components/button-group/button-group.component.ts` | 52-90 | divider 组件通过父级注入推导方向（vertical group -> horizontal divider）。 |
| Z3 | `/Users/wanyaozhong/projects/zardui/src/app/shared/components/button-group/button-group.component.ts` | 92-103 | `z-button-group-text` 以 attribute directive 形态提供，支持无额外包裹节点的文本槽。 |
| Z4 | `/Users/wanyaozhong/projects/zardui/src/app/shared/components/button-group/button-group.variants.ts` | 3-18 | zardui 组布局变体（orientation + nested gap）与 shadcn 主路径高度相似。 |
| Z5 | `/Users/wanyaozhong/projects/zardui/src/app/shared/components/button-group/button-group.variants.ts` | 21-35 | divider/text 的 plain 风格基线（低装饰、token 驱动）。 |

## Usage Evidence (Doc + Demo)
| id | file | lines | scenario |
| --- | --- | --- | --- |
| U1 | `rg -n "z-button-group|zButtonGroup" /Users/wanyaozhong/projects/zardui` | command output | zardui 仓库未找到 button-group 的独立 doc/demo，仅有组件源码。 |
| U2 | `https://ui.shadcn.com/r/styles/radix-mira/button-group-example.json` | `ButtonGroupWithText` 片段 | `ButtonGroupText` 普通用法 + `asChild` 用法。 |
| U3 | `https://ui.shadcn.com/r/styles/radix-mira/button-group-example.json` | `ButtonGroupWithDropdown` / `ButtonGroupNested` / `ButtonGroupVerticalNested` 片段 | mira 示例核心复杂路径，用于本地 preview 对标。 |

## Local Baseline Evidence
| id | file | lines | current behavior |
| --- | --- | --- | --- |
| L1 | `git show HEAD:src/app/shared/ui/button-group/button-group.component.ts` | 27-37, 100-150 | 旧实现仍使用 `app-button-group*` 命名，未迁移到 `argusx-*`。 |
| L2 | `git show HEAD:src/app/shared/ui/button-group/button-group.component.ts` | 55-81 | 旧组样式包含单子项修补 class，且 `gap-2` 恒定开启，与 shadcn nested-only 行为不一致。 |
| L3 | `git show HEAD:src/app/shared/ui/button-group/button-group.component.ts` | 118-124, 165-173 | 旧 text/separator 样式与 shadcn 差异（text 尺寸偏小、separator 未复用 shadcn class 语义）。 |
| L4 | `git show HEAD:src/app/preview/button-group-preview.component.ts` | 16-67 | 旧 preview 仅覆盖基本场景，缺少复杂组合与扩展 API 场景。 |
