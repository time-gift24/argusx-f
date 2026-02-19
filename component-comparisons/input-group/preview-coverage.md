# input-group Preview Coverage

## Required Scenarios
- [x] 基本 input group 用法 (URL Input)
- [x] addon 组合用法 (Search Input)
- [x] textarea group 用法
- [x] button 在 addon 中的使用
- [x] 扩展 API: disabled 状态
- [x] 扩展 API: loading 状态 (可选)

## Local Preview Routes
- main: `/preview?component=input-group`
- reference: `https://ui.shadcn.com/preview/radix/input-group-example`

## Verification Notes
- build: `ng build` - PASSED
- tests: 无 spec 文件，跳过
- manual check: 打开 `/preview?component=input-group` 确认渲染正确
