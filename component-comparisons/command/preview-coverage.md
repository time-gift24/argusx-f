# command Preview Coverage

## Required Scenarios
- [x] all conflict APIs with shadcn-aligned behavior
  - `argusx-command-dialog` + `argusx-command` 组件层路径已覆盖。
- [x] all non-conflict extension APIs in plain style
  - `keywords`、`autoHighlight`、`loop` 的实现路径已落地（preview 主要展示主路径 + disabled/shortcut/group 组合）。
- [x] all key state combinations
  - searchable、highlighted、disabled、dialog open/close、group separator、shortcut indicator。
- [x] shadcn preview parity examples
  - Inline / Basic / With Shortcuts / With Groups / Many Groups & Items 全覆盖。
- [x] one complex combined scenario
  - Many Groups & Items 同时覆盖多组、快捷键、禁用态、长列表滚动。

## Local Preview Routes
- main: `/preview?component=command`
- route source: `src/app/app.routes.ts` (`path: 'command'`)
- sidebar entry: `src/app/preview/preview-layout.component.ts` (`id: 'command'`)
- reference:
  - `https://ui.shadcn.com/preview/radix/command-example`
  - `https://ui.shadcn.com/preview/radix/command-example?item=kbd-example&style=mira&theme=cyan&font=nunito-sans&menuAccent=bold&radius=medium&template=vite`

## Verification Notes
- build:
  - `npx ng build` ✅ (2026-02-19)  
    note: 保留仓库既有 CommonJS/size budget warnings（markdown/mermaid/prism 相关），与 command 改造无直接回归关联。
- tests:
  - `npx vitest run src/app/shared/ui/command/command.component.spec.ts` ✅ (9/9)
  - `npx vitest run src/app/shared/ui/menu-core/focus.spec.ts` ✅ (7/7)
  - `npx vitest run src/app/shared/ui/menu-core/focus.spec.ts src/app/shared/ui/command/command.component.spec.ts` ✅ (16/16)
- manual check:
  - `/preview?component=command` ✅ (2026-02-19)
  - 确认 5 个标题场景均渲染：Inline / Basic / With Shortcuts / With Groups / Many Groups & Items
  - 验证 Basic dialog：输入无匹配词显示 `No results found.`，键盘 `ArrowDown + Enter` 可完成选择并回填 “Last selected action”
  - 验证 Many Groups & Items：禁用项 `Paste` 在过滤后保留 disabled 状态，`Enter` 不会误触发选择
