# input-group Source Understanding

## Mapping
- local: `input-group`
- zardui: `input-group`
- shadcn: `input-group`
- rationale: 三方命名一致，API 主导权按本次约束固定为 `shadcn > local/zardui`。

## shadcn Evidence (Target API Primary)
| id | file | lines | note |
| --- | --- | --- | --- |
| S1 | shadcn MCP: `input-group-demo` | 1-45 | `InputGroup` 组件包含 `InputGroupInput`, `InputGroupAddon`, `InputGroupButton`, `InputGroupText`, `InputGroupTextarea` 等子组件。 |
| S2 | shadcn MCP: `input-group-demo` | 14-23 | `InputGroupAddon` 支持 `align` 属性 (inline-start/inline-end/block-start/block-end)。 |
| S3 | shadcn MCP: `input-group-demo` | 24-38 | `InputGroupButton` 支持 `variant` 和 `size` 属性。 |

## ZardUI Evidence
| id | file | lines | note |
| --- | --- | --- | --- |
| Z1 | WebFetch: `zardui/libs/zard/src/lib/shared/components/input-group/input-group.component.ts` | 1-130 | `ZardInputGroupComponent` 使用 z-input directive，支持 addonBefore/addonAfter 作为 string 或 TemplateRef。 |
| Z2 | WebFetch: `zardui/libs/zard/src/lib/shared/components/input-group/input-group.component.ts` | 44-52 | 支持 loading/disabled/size 状态，通过 effect 同步到内部 input。 |
| Z3 | WebFetch: `zardui/libs/zard/src/lib/shared/components/input-group/input-group.component.ts` | 56-67 | 使用 `inputGroupVariants`, `inputGroupAddonVariants`, `inputGroupInputVariants` 组织样式。 |

## Usage Evidence (Doc + Demo)
| id | file | lines | scenario |
| --- | --- | --- | --- |
| U1 | 本地 preview | 34-42 | URL Input 场景，使用 addon 包裹文本。 |
| U2 | 本地 preview | 52-58 | Search Input 场景，addon + button 组合。 |
| U3 | 本地 preview | 67-73 | Textarea Group 场景。 |

## Local Baseline Evidence (Before Rewrite)
| id | file | lines | current behavior |
| --- | --- | --- | --- |
| L1 | `src/app/shared/ui/input-group/input-group.component.ts` | 21-36 | 使用 `app-input-group` selector，需要迁移到 `argusx-input-group`。 |
| L2 | `src/app/shared/ui/input-group/input-group.component.ts` | 38-69 | 已有 shadcn 对齐的 class 样式，使用 cn() 和 computed()。 |
| L3 | `src/app/shared/ui/input-group/input-group-addon.component.ts` | 56-64 | 使用 `app-input-group-addon` selector，需要迁移。 |
