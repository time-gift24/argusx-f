# drawer Preview Coverage

## Required Scenarios
- [x] all conflict APIs with shadcn-aligned behavior  
  - baseline section 覆盖 slot 结构 + `argusxDrawerTrigger/argusxDrawerClose` 主路径。
- [x] all non-conflict extension APIs in plain style  
  - `size` 切换 + `showCloseButton` 场景使用中性 plain 样式。
- [x] all key state combinations  
  - direction 切换、受控 open、`dismissible=false`、显式 close 行为。
- [x] shadcn preview parity examples  
  - baseline 场景对齐 shadcn drawer 典型结构（trigger/content/header/footer/close）。
- [x] one complex combined scenario  
  - `open + direction + size + dismissible + shouldScaleBackground` 组合示例。

## Local Preview Routes
- main: `/preview?component=drawer`
- reference: `https://ui.shadcn.com/preview/radix/drawer-example`

## Verification Notes
- build:
  - command: `npm run build`
  - result: pass (exit 0)
  - note: 仅有仓库既有 CommonJS 优化警告（markdown/mermaid 相关），与 drawer 改动无关。
- tests:
  - drawer spec 文件不存在（`rg --files src/app/shared/ui/drawer | rg -i 'spec|test'` 无结果），未执行组件定向测试。
- manual check:
  - served route: `http://127.0.0.1:4300/preview?component=drawer`
  - verified via browser snapshot + interaction:
    - 页面出现四个区块：`shadcn Baseline`、`Direction (shadcn API)`、`ArgusX Plain Extension`、`Complex Combination`
    - 点击 `Open Drawer` 后出现 `dialog "Move Goal"`，`Cancel` 可正常关闭
    - 点击 `Programmatic Open` 后出现 `dialog "Controlled Drawer"`，组合状态正确渲染
