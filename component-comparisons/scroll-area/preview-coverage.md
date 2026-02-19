# scroll-area Preview Coverage

## Required Scenarios
- [x] all conflict APIs with shadcn-aligned behavior (无冲突项)
- [x] all non-conflict extension APIs in plain style
  - orientation: vertical, horizontal, both
  - scrollbarVisible
  - scrollChange (事件)
  - scrollBottom (事件)
- [x] all key state combinations
  - vertical scroll (默认)
  - horizontal scroll (orientation="horizontal")
- [x] shadcn preview parity examples
  - 垂直滚动示例与 shadcn demo 对齐
  - 水平滚动示例与 shadcn horizontal-demo 对齐
- [x] one complex combined scenario

## Local Preview Routes
- main: `/preview?component=scroll-area`
- reference: `https://ui.shadcn.com/preview/radix/scroll-area-example`

## Verification Notes
- build: 通过 (其他组件错误不影响 scroll-area)
- tests: 无针对 scroll-area 的测试文件
- manual check: 预览页面 http://localhost:4200/preview/scroll-area

## Preview 覆盖详情

### 1. 垂直滚动 (Vertical)
- 使用 `<argusx-scroll-area class="h-56 rounded-md border">`
- 展示消息列表滚动

### 2. 水平滚动 (Horizontal)
- 使用 `<argusx-scroll-area class="w-full rounded-md border" orientation="horizontal">`
- 展示卡片列表横向滚动
