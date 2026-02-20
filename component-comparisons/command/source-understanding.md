# command Source Understanding

## Mapping
- local: `command`
- zardui: `command`
- shadcn: `command`
- rationale: 三方都是同一类命令面板组件，名称不需要映射；本次以 shadcn 组件层 API 为主约束，zardui 行为作为内部实现参考。

## shadcn Baseline Evidence
| id | file | lines | note |
| --- | --- | --- | --- |
| S1 | `/tmp/shadcn-ui-argusx-input-group/apps/v4/registry/bases/radix/ui/command.tsx` | 20-34 | `Command` root 以 `data-slot="command"` 暴露主容器。 |
| S2 | `/tmp/shadcn-ui-argusx-input-group/apps/v4/registry/bases/radix/ui/command.tsx` | 36-66 | `CommandDialog` 提供 `title/description/showCloseButton` 并复用 dialog。 |
| S3 | `/tmp/shadcn-ui-argusx-input-group/apps/v4/registry/bases/radix/ui/command.tsx` | 68-96 | `CommandInput` 使用 `command-input-wrapper` 与输入槽位。 |
| S4 | `/tmp/shadcn-ui-argusx-input-group/apps/v4/registry/bases/radix/ui/command.tsx` | 98-151 | `CommandList/Empty/Group/Separator` 均为独立 slot。 |
| S5 | `/tmp/shadcn-ui-argusx-input-group/apps/v4/registry/bases/radix/ui/command.tsx` | 153-203 | `CommandItem/Shortcut` 数据槽位、禁用态与 indicator 结构。 |
| S6 | `/tmp/shadcn-ui-argusx-input-group/apps/v4/registry/bases/radix/examples/command-example.tsx` | 24-34 | 示例页面固定 5 组场景（Inline/Basic/With Shortcuts/With Groups/Many Groups & Items）。 |
| S7 | `/tmp/shadcn-ui-argusx-input-group/apps/v4/registry/bases/radix/examples/command-example.tsx` | 36-119 | Inline 场景：分组、图标、快捷键、分隔符组合。 |
| S8 | `/tmp/shadcn-ui-argusx-input-group/apps/v4/registry/bases/radix/examples/command-example.tsx` | 121-150, 152-211, 213-305, 307-360 | 四个 dialog 场景由按钮打开并复用同一 command 结构。 |

## ZardUI Evidence
| id | file | lines | note |
| --- | --- | --- | --- |
| Z1 | `/tmp/zardui/libs/zard/src/lib/shared/components/command/command.component.ts` | 83-151 | root 维护 `searchTerm/filteredOptions`，并根据搜索词计算可见项。 |
| Z2 | `/tmp/zardui/libs/zard/src/lib/shared/components/command/command.component.ts` | 194-233 | root 键盘处理 `ArrowUp/ArrowDown/Enter/Escape` 与选择索引。 |
| Z3 | `/tmp/zardui/libs/zard/src/lib/shared/components/command/command-input.component.ts` | 84-115 | input 将输入同步到 root，并转发导航键。 |
| Z4 | `/tmp/zardui/libs/zard/src/lib/shared/components/command/command-option.component.ts` | 87-123 | option 依据 root 搜索状态动态显隐，点击触发选择。 |
| Z5 | `/tmp/zardui/libs/zard/src/lib/shared/components/command/command-option-group.component.ts` | 58-72 | group 依据子 option 可见性自动隐藏。 |
| Z6 | `/tmp/zardui/libs/zard/src/lib/shared/components/command/command-divider.component.ts` | 27-42 | divider 对搜索态有条件显示逻辑。 |
| Z7 | `/tmp/zardui/libs/zard/src/lib/shared/components/command/index.ts` | 1-9 | command 家族通过 index barrel 暴露。 |

## Usage Evidence (Doc + Demo)
| id | file | lines | scenario |
| --- | --- | --- | --- |
| U1 | `/tmp/zardui/apps/web/public/components/command/doc/api.md` | 7-17 | root 输入/事件 (`size/class` + `zCommandChange/zCommandSelected`)。 |
| U2 | `/tmp/zardui/apps/web/public/components/command/doc/api.md` | 21-35 | input 占位符与 `valueChange` 事件。 |
| U3 | `/tmp/zardui/apps/web/public/components/command/doc/api.md` | 58-72 | option 参数：`zValue/zLabel/zShortcut/zDisabled/variant`。 |
| U4 | `/tmp/zardui/apps/web/public/components/command/demo/default.md` | 13-37 | demo 展示多 group + divider + shortcut 组合。 |
| U5 | `/tmp/zardui/apps/web/public/components/command/demo/default.md` | 46-76 | demo 中选择回调驱动业务动作反馈。 |

## Local Baseline Evidence
| id | file | lines | current behavior |
| --- | --- | --- | --- |
| L1 | `src/app/shared/ui/command/command.component.ts` | 93-170 | 新 root 使用 `value` 作为搜索词、默认 plain、维护高亮与可见项注册。 |
| L2 | `src/app/shared/ui/command/command.component.ts` | 181-287 | 新 root 键盘行为对齐 `Arrow/Home/End/Enter/Escape`，并通过 menu-core helper 聚焦。 |
| L3 | `src/app/shared/ui/command/command.component.ts` | 296-341 | 新增 `argusx-command-dialog`，内部复用 dialog primitives。 |
| L4 | `src/app/shared/ui/command/command.component.ts` | 441-555 | group/empty/separator 数据槽位与显隐规则已经落地。 |
| L5 | `src/app/shared/ui/command/command.component.ts` | 561-750 | item 输出 `select(value)`，并提供 data-slot/data-selected/data-disabled/data-checked。 |
| L6 | `src/app/preview/command-preview.component.ts` | 63-219 | preview 覆盖 5 组 shadcn 示例场景并接入新 argusx API。 |
| L7 | `src/app/shared/ui/menu-core/focus.ts` | 1-103 | menu-core 扩展了通用/command focus helper，command roving 复用该底层能力。 |
