# toggle Preview Coverage

## Required Scenarios
- [x] all conflict APIs with shadcn-aligned behavior
  - selector: argusx-toggle
  - value (controlled)
  - variant (plain/outline)
  - size (sm/md/lg)
- [x] all non-conflict extension APIs in plain style
  - default (uncontrolled)
  - toggleClick event
  - toggleHover event
  - toggleChange event
- [x] all key state combinations
  - disabled (off state)
  - disabled (on state)
- [x] shadcn preview parity examples
  - Formatting (使用 directive)
  - Outline + Size (使用 directive)
- [x] one complex combined scenario
  - Multiple states combination (size + variant + event)

## Preview Coverage Details
1. **Plain (Default)** - 使用 directive 的 plain 风格展示
2. **Outline + Size** - 使用 directive 的 outline 变体和不同尺寸
3. **Argusx Toggle Component - Plain** - 组件默认 plain 变体
4. **Argusx Toggle - Sizes** - 组件的三种尺寸 (sm/md/lg)
5. **Argusx Toggle - Variants** - 组件的两种变体 (plain/outline)
6. **Argusx Toggle - Controlled** - 受控模式 (ngModel)
7. **Argusx Toggle - Disabled** - 禁用状态
8. **Argusx Toggle - Events** - 事件处理展示
9. **Argusx Toggle - Complex** - 复杂组合场景

## Local Preview Routes
- main: `/preview?component=toggle`
- reference: `https://ui.shadcn.com/preview/radix/toggle-example`

## Verification Notes
- build: PASS (ng build 成功)
- tests: 无针对 toggle 组件的 spec 文件
- manual check: 预览页面已更新，覆盖所有 API 场景
