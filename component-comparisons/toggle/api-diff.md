# toggle API Diff

## API Matrix
| api | zardui | local (current) | shadcn | target (argusx) | conflict? | decision | plain note | evidence |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| selector | z-toggle | appToggle (directive) | Toggle | argusx-toggle | yes | adopt-shadcn | N/A | Z1, L1 |
| value | zValue | N/A | pressed | value | yes | adopt-shadcn | Controlled value | Z1 |
| default | zDefault | N/A | N/A | default | no | extend-argusx | Uncontrolled default state | Z1 |
| variant | zType (default/outline) | variant (default/outline) | variant (default/outline) | variant (plain/outline) | yes | adopt-shadcn | 默认 plain | Z2, S1-S3 |
| size | zSize (sm/md/lg) | size (default/sm/lg) | size (default/sm/lg) | size (sm/md/lg) | yes | adopt-shadcn | 默认 md | Z2, S1-S3 |
| disabled | zDisabled | N/A | disabled | disabled | no | adopt-shadcn | Disabled state | Z1 |
| aria-label | zAriaLabel | N/A | aria-label | ariaLabel | no | adopt-shadcn | Accessibility | Z1 |
| change event | zToggleChange | N/A | onPressedChange | toggleChange | yes | adopt-shadcn | Value change event | Z1 |
| click event | zToggleClick | N/A | N/A | toggleClick | no | extend-argusx | Click event | Z1 |
| hover event | zToggleHover | N/A | N/A | toggleHover | no | extend-argusx | Hover event | Z1 |
| class | class | class | class | class | no | adopt-shadcn | Custom class | Z1, L1 |

## Conflict Decisions (Must Adopt shadcn)
- [x] selector: z-toggle -> argusx-toggle，采用 shadcn 的命名风格
- [x] value: zValue -> value，与 shadcn 的 pressed 语义对齐
- [x] variant: zType -> variant，默认值从 'default' 改为 'plain'（ArgusX plain 风格）
- [x] size: zSize -> size，保持 sm/md/lg 尺寸
- [x] change event: zToggleChange -> toggleChange，与 shadcn onPressedChange 对齐

## Non-conflict Extensions (ArgusX Plain)
- [x] default: 添加 uncontrolled 模式的默认值支持，shadcn 无此能力
- [x] toggleClick: 点击事件，shadcn 无独立 click 事件
- [x] toggleHover: 悬停事件，扩展交互能力

## Missing APIs
- [ ] N/A - 本次实现了 zardui 的全部能力

## Behavior Mismatches
- [x] variant 默认值: zardui 使用 'default'，argusx 改为 'plain' 以符合 plain 风格要求
- [x] size 默认值: zardui 使用 'md'，保持不变

## Final Target API
- selectors: `argusx-toggle`
- inputs:
  - `value: boolean | undefined` - 受控值
  - `default: boolean` - 非受控默认值
  - `disabled: boolean` - 禁用状态
  - `variant: 'plain' | 'outline'` - 样式变体
  - `size: 'sm' | 'md' | 'lg'` - 尺寸
  - `ariaLabel: string` - 可访问标签
  - `class: ClassValue` - 自定义类
- outputs:
  - `toggleChange: OutputEmitter<boolean>` - 值变化事件
  - `toggleClick: OutputEmitter<void>` - 点击事件
  - `toggleHover: OutputEmitter<void>` - 悬停事件
- data attributes:
  - `data-state: 'on' | 'off'` - 状态
  - `data-variant` - 变体（透传）
  - `data-size` - 尺寸（透传）
- accessibility contract:
  - `aria-pressed` - ARIA 按压状态
  - `aria-label` - 屏幕阅读器标签
- plain style defaults:
  - `variant: 'plain'` - 默认使用 plain 风格（无边框、简洁）
  - `size: 'md'` - 默认中等尺寸
